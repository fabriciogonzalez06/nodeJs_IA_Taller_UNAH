-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-10-2021 a las 22:36:01
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `creditosdebitos`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_clientes` (`p_idUsuario` INT)  begin
	
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
	
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_clientes_crear_actualizar` (`p_idCliente` INT, `p_nombreCompleto` VARCHAR(200), `p_idUsuario` INT)  begin
	
	
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
	
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_clientes_eliminar` (`p_idCliente` INT, `p_idUsuario` INT)  begin
	
	
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
		
	
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_transacciones` (`p_id` INT, `p_idTipoTransaccion` TINYINT, `p_idCliente` INT)  begin
	
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
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_transacciones_crear_actualizar` (`p_id` INT, `p_idTipoTransaccion` TINYINT, `p_idCliente` INT, `p_idUsuario` INT, `p_cantidad` FLOAT, `p_comentario` VARCHAR(500))  begin
	
	
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
	
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_transaccion_eliminar` (`p_id` INT, `p_idCliente` INT, `p_idUsuario` INT)  begin
	
	
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
		
	
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_usuario_crear` (`p_correo` VARCHAR(200), `p_contrasena` TEXT)  begin
	
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
	
		if exists (select 1 from tbl_usuario tu where tu.correo = p_correo  ) then
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
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbl_usuario_eliminar` (`p_id` INT)  begin
	
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
end$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_obtener_nombre_usuario` (`idUsuario` INT) RETURNS TEXT CHARSET utf8mb4 begin
	declare _usuario text;

	set _usuario = (select correo from tbl_usuario tu where tu.id = idUsuario limit 1);

	return IFNULL(_usuario,'Indeterminado');
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_cliente`
--

CREATE TABLE `tbl_cliente` (
  `id` int(11) NOT NULL,
  `nombreCompleto` varchar(200) NOT NULL,
  `fechaRegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `creadoPor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tbl_cliente`
--

INSERT INTO `tbl_cliente` (`id`, `nombreCompleto`, `fechaRegistro`, `creadoPor`) VALUES
(1, 'Marco Tulio Vega', '2021-10-09 11:58:34', 1),
(4, 'Jose Martinez', '2021-10-09 15:01:42', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tipotransaccion`
--

CREATE TABLE `tbl_tipotransaccion` (
  `id` tinyint(4) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `fechaRegistro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tbl_tipotransaccion`
--

INSERT INTO `tbl_tipotransaccion` (`id`, `tipo`, `fechaRegistro`) VALUES
(1, 'Crédito', '2021-10-09 15:14:14'),
(2, 'Débito', '2021-10-09 15:14:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_transaccion`
--

CREATE TABLE `tbl_transaccion` (
  `id` int(11) NOT NULL,
  `idTipoTransaccion` tinyint(4) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `creadoPor` int(11) NOT NULL,
  `cantidad` float NOT NULL,
  `comentario` varchar(500) DEFAULT 'No se agrego descripcion',
  `fechaRegistro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tbl_transaccion`
--

INSERT INTO `tbl_transaccion` (`id`, `idTipoTransaccion`, `idCliente`, `creadoPor`, `cantidad`, `comentario`, `fechaRegistro`) VALUES
(1, 1, 1, 1, 400.3, 'Crédito a corto plazo', '2021-10-09 15:44:58'),
(2, 1, 4, 1, 7000.3, 'Crédito a largo plazo', '2021-10-09 15:46:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_usuario`
--

CREATE TABLE `tbl_usuario` (
  `id` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `contrasena` text NOT NULL,
  `fechaRegistro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tbl_usuario`
--

INSERT INTO `tbl_usuario` (`id`, `correo`, `contrasena`, `fechaRegistro`) VALUES
(1, 'angelfabricio@gmail.com', '12345', '2021-10-08 18:16:47'),
(16, 'prueba1234@gmail.com', '$2b$10$vtb8D0xZP2mojBgiTkrDMeVQbrFJbODW42bhfbrou2Q8LBPtFQAeO', '2021-10-08 21:23:43'),
(18, 'fabricio@gmail.com', '$2b$10$eN4rYgGCksoEu6YLVbg.feTBe4AlcOB4dI6LK9L4IFsBkfXbDEgeO', '2021-10-10 11:52:57');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbl_cliente`
--
ALTER TABLE `tbl_cliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`creadoPor`);

--
-- Indices de la tabla `tbl_tipotransaccion`
--
ALTER TABLE `tbl_tipotransaccion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tbl_transaccion`
--
ALTER TABLE `tbl_transaccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tipo_transaccion` (`idTipoTransaccion`),
  ADD KEY `fk_cliente_transaccion` (`idCliente`),
  ADD KEY `fk_usuario_transaccion` (`creadoPor`);

--
-- Indices de la tabla `tbl_usuario`
--
ALTER TABLE `tbl_usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbl_cliente`
--
ALTER TABLE `tbl_cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tbl_tipotransaccion`
--
ALTER TABLE `tbl_tipotransaccion`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_transaccion`
--
ALTER TABLE `tbl_transaccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_usuario`
--
ALTER TABLE `tbl_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbl_cliente`
--
ALTER TABLE `tbl_cliente`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`creadoPor`) REFERENCES `tbl_usuario` (`id`);

--
-- Filtros para la tabla `tbl_transaccion`
--
ALTER TABLE `tbl_transaccion`
  ADD CONSTRAINT `fk_cliente_transaccion` FOREIGN KEY (`idCliente`) REFERENCES `tbl_cliente` (`id`),
  ADD CONSTRAINT `fk_tipo_transaccion` FOREIGN KEY (`idTipoTransaccion`) REFERENCES `tbl_tipotransaccion` (`id`),
  ADD CONSTRAINT `fk_usuario_transaccion` FOREIGN KEY (`creadoPor`) REFERENCES `tbl_usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
