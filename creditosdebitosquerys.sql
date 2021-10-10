create database creditosDebitos;
use creditosDebitos;


create table tbl_tipoTransaccion(
	id tinyint auto_increment not null,
	tipo varchar(20) not null,
	fechaRegistro datetime not null default current_timestamp ,
	constraint pk_tipo_transaccion primary key(id)
);

create table tbl_usuario(
	id int auto_increment not null,
	correo varchar(200) not null,
	contrasena text not null,
	fechaRegistro datetime not null default current_timestamp ,
	constraint pk_tbl_usuario primary key(id)
);

create table tbl_cliente(
	id int auto_increment not null,
	nombreCompleto varchar(200) not null,
	fechaRegistro datetime not null default current_timestamp ,
	creadoPor int not null,
	constraint pk_cliente primary key(id),
	constraint fk_usuario foreign key(creadoPor) references tbl_usuario(id)
);

create table tbl_transaccion(
	id int auto_increment not null,
	idTipoTransaccion tinyint not null,
	idCliente int not null,
	creadoPor int not null,
	cantidad float not null,
	comentario varchar(500) default 'No se agrego descripcion',
	fechaRegistro datetime not null default current_timestamp ,
	constraint pk_transaccion primary key(id),
	constraint fk_tipo_transaccion foreign key(idTipoTransaccion) references tbl_tipoTransaccion(id),
	constraint fk_cliente_transaccion foreign key(idCliente) references tbl_cliente(id),
	constraint fk_usuario_transaccion foreign key(creadoPor) references tbl_usuario(id)
);



create procedure sp_tbl_usuario_crear(
	p_correo varchar(200),
	p_contrasena text
)
begin
	
		declare exit handler for sqlexception
		begin
			rollback;
			resignal;
		end;
	
		declare exit handler for sqlwarning
		begin
			rollback;
			resignal;
		end;
	
		if  exists (select 1 from tbl_usuario tu where tu.correo = p_correo  ) then
			signal sqlstate '60000' set message_text = 'Usuario ya existe';
		end if;
	
		start transaction;
			insert into tbl_usuario 
			(
				correo,
				contrasena 
			)
			values
			(
				p_correo,
				p_contrasena
			);
		commit;
	
		select id, correo ,fechaRegistro from tbl_usuario tu where tu.id  = last_insert_id() ; 
end;

create procedure sp_tbl_usuario_eliminar(
	p_id int
)
begin
	
		declare exit handler for sqlexception
		begin
			rollback;
			resignal;
		end;
	
		declare exit handler for sqlwarning
		begin
			rollback;
			resignal;
		end;
	
		if not exists (select 1 from tbl_usuario tu where tu.id = p-id  ) then
			signal sqlstate '60000' set message_text = 'No se encontro usuario a eliminar.';
		end if;
	
		start transaction;
			delete  from tbl_usuario where id = p_id;
		commit;
	
		select 'Usuario eliminado correctamente' as mensaje ; 
end;



create function fn_obtener_nombre_usuario(idUsuario int)
returns text
begin
	declare _usuario text;

	set _usuario = (select correo from tbl_usuario tu where tu.id = idUsuario limit 1);

	return IFNULL(_usuario,'Indeterminado');
end;




create procedure sp_tbl_clientes(p_idUsuario int)
begin
	
	if ( p_idUsuario is null ) then
	
		select 
		id,
		nombreCompleto, 
		creadoPor  as idUsuario,
		fn_obtener_nombre_usuario(creadoPor) as usuario,
		fechaRegistro 
		from  creditosdebitos.tbl_cliente order by nombreCompleto;
	
	else
	
		if not exists( select  1 from tbl_cliente tc where tc.id = p_idUsuario) then 
			signal sqlstate '60000' set message_text = 'No se encontro el cliente';
		end if;
		
	
		select 
		id,
		nombreCompleto, 
		creadoPor  as idUsuario,
		fn_obtener_nombre_usuario(creadoPor) as usuario,
		fechaRegistro 
		from  creditosdebitos.tbl_cliente where id= p_idUsuario;
		
	end if;
	
end;


create procedure sp_tbl_clientes_crear_actualizar(
	p_idCliente int,
	p_nombreCompleto varchar(200),
	p_idUsuario int
)
begin
	
	
	declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end ;
    
    declare exit handler for sqlwarning
    begin 
		rollback;
        resignal;
    end ;
	
	if ( p_idCliente is null ) then
	
		start transaction;
		insert into tbl_cliente
		(
			nombreCompleto, 
			creadoPor 
		)
		values
		(
			p_nombreCompleto,
			p_idUsuario  
		);
		commit;
	
		select 
		id,
		nombreCompleto, 
		creadoPor  as idUsuario,
		fn_obtener_nombre_usuario(creadoPor) as usuario,
		fechaRegistro 
		from  creditosdebitos.tbl_cliente where id= last_insert_id();
	
	else
	
		if not exists( select  1 from tbl_cliente tc where tc.id = p_idCliente) then 
			signal sqlstate '60000' set message_text = 'No se encontro el cliente a actualizar';
		end if;
	
		start transaction;
	
		update tbl_cliente set nombreCompleto  = p_nombreCompleto where id= p_idCliente ;
		
		commit;
	
		select 
		id,
		nombreCompleto, 
		creadoPor  as idUsuario,
		fn_obtener_nombre_usuario(creadoPor) as usuario,
		fechaRegistro 
		from  creditosdebitos.tbl_cliente where id= p_idCliente;
		
	end if;
	
end;


create procedure sp_tbl_clientes_eliminar(
	p_idCliente int,
	p_idUsuario int
)
begin
	
	
	declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end ;
    
    declare exit handler for sqlwarning
    begin 
		rollback;
        resignal;
    end ;
	
	
	if not exists( select  1 from tbl_cliente tc where tc.id = p_idCliente) then 
		signal sqlstate '60000' set message_text = 'No se encontro el cliente a eliminar';
	end if;

	start transaction;

	delete from tbl_cliente where id= p_idCliente ;
	
	commit;

	select 'Cliente eliminado correctament' as mensaje;
		
	
end;



create procedure sp_tbl_transacciones(p_id int, p_idTipoTransaccion tinyint, p_idCliente int )
begin
	
	select 
	tt.id,
	tt.idTipoTransaccion,
	tipot.tipo as tipoTransaccion,
	tt.idCliente,
	tc.nombreCompleto as cliente,
	tt.creadoPor as idUsuario,
	fn_obtener_nombre_usuario(tt.creadoPor) as usuario,
	tt.cantidad,
	tt.comentario,
	tt.fechaRegistro
	from tbl_transaccion tt
	inner join tbl_cliente tc on tt.idCliente  = tc.id
	inner join tbl_tipotransaccion tipot on tt.idTipoTransaccion = tipot.id
	where tt .id =  case when  (p_id > 0 or p_id is not null) then p_id else tt.id  end
	and tt .idTipoTransaccion = case when  (p_idTipoTransaccion > 0 or p_idTipoTransaccion is not null) then p_idTipoTransaccion else tt.idTipoTransaccion  end
	and tt.idCliente = case when  (p_idCliente > 0 or p_idCliente is not null) then p_idCliente else tt.idCliente  end; 
end;




create procedure sp_tbl_transacciones_crear_actualizar(
	p_id int,
	p_idTipoTransaccion tinyint,
	p_idCliente int,
	p_idUsuario int,
	p_cantidad float,
	p_comentario varchar(500)
)
begin
	
	
	declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end ;
    
    declare exit handler for sqlwarning
    begin 
		rollback;
        resignal;
    end ;
	
	if ( p_id is null ) then
	
		start transaction;
		insert into tbl_transaccion 
		(
			idTipoTransaccion,
			idCliente,
			creadoPor,
			cantidad,
			comentario 
		)
		values
		(
			p_idTipoTransaccion,
			p_idCliente,
			p_idUsuario,
			p_cantidad,
			p_comentario
		);
		commit;
	
		call sp_tbl_transacciones(last_insert_id(),null,null);
	
	else
	
		if not exists( select  1 from tbl_transaccion tt  where tt.id = p_id) then 
			signal sqlstate '60000' set message_text = 'No se encontro la transacción a actualizar';
		end if;
	
		if not exists( select  1 from tbl_transaccion tt  where tt.id = p_id and tt.idCliente = p_idCliente ) then 
				signal sqlstate '60000' set message_text = 'Acción no permitida';
			end if;
	
	
		start transaction;
	
		update tbl_transaccion tc  set
			idTipoTransaccion = p_idTipoTransaccion,
			idCliente = p_idCliente,
			creadoPor = p_idUsuario,
			cantidad = p_cantidad,
			comentario = p_comentario
			where tc.id = p_id and tc.idCliente = p_idCliente;
		
		commit;
	
		call sp_tbl_transacciones(p_id,null,p_idCliente);
		
	end if;
	
end;



create procedure sp_tbl_transaccion_eliminar(
	p_id int,
	p_idCliente int,
	p_idUsuario int
)
begin
	
	
	declare exit handler for sqlexception
    begin
		rollback;
        resignal;
	end ;
    
    declare exit handler for sqlwarning
    begin 
		rollback;
        resignal;
    end ;
	
	
	if not exists( select  1 from tbl_transaccion tt  where tt.id = p_id and tt.idCliente  = p_idCliente) then 
		signal sqlstate '60000' set message_text = 'No se encontro la transacción.';
	end if;

	start transaction;

	delete from tbl_transaccion where id= p_id and idCliente = p_idCliente;
	
	commit;

	select 'Transaccion eliminada correctamente' as mensaje;
		
	
end;



