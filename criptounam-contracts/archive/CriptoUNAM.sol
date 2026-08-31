// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CriptoUNAM
 * @dev Contrato principal para manejar cursos y compras de CriptoUNAM
 */
contract CriptoUNAM is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Estructuras de datos
    struct Curso {
        uint256 id;
        string titulo;
        string nivel;
        string duracion;
        string imagen; // IPFS hash
        string descripcion;
        string instructor;
        uint256 precio;
        uint256 estudiantes;
        uint256 rating;
        string[] categorias;
        string requisitos;
        Leccion[] lecciones;
        address creador;
        bool activo;
        uint256 fechaCreacion;
    }

    struct Leccion {
        string titulo;
        string video; // IPFS hash o URL
        string descripcion;
    }

    struct Compra {
        uint256 cursoId;
        address comprador;
        uint256 precio;
        uint256 fechaCompra;
        bool activa;
    }

    // Variables de estado
    Counters.Counter private _cursoIds;
    Counters.Counter private _compraIds;
    
    mapping(uint256 => Curso) public cursos;
    mapping(uint256 => Compra) public compras;
    mapping(address => uint256[]) public cursosPorCreador;
    mapping(address => uint256[]) public comprasPorUsuario;
    mapping(address => bool) public admins;
    mapping(address => mapping(uint256 => bool)) public tieneAcceso;

    // Eventos
    event CursoCreado(uint256 indexed cursoId, string titulo, address indexed creador);
    event CursoActualizado(uint256 indexed cursoId);
    event CursoEliminado(uint256 indexed cursoId);
    event CursoComprado(uint256 indexed cursoId, address indexed comprador, uint256 precio);
    event AdminAgregado(address indexed admin);
    event AdminRemovido(address indexed admin);

    // Modificadores
    modifier soloAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Solo admins pueden ejecutar esta funcion");
        _;
    }

    modifier cursoExiste(uint256 _cursoId) {
        require(cursos[_cursoId].id != 0, "Curso no existe");
        _;
    }

    modifier cursoActivo(uint256 _cursoId) {
        require(cursos[_cursoId].activo, "Curso no esta activo");
        _;
    }

    constructor() {
        admins[msg.sender] = true;
        emit AdminAgregado(msg.sender);
    }

    /**
     * @dev Crear un nuevo curso (solo admins)
     */
    function crearCurso(
        string memory _titulo,
        string memory _nivel,
        string memory _duracion,
        string memory _imagen,
        string memory _descripcion,
        string memory _instructor,
        uint256 _precio,
        string[] memory _categorias,
        string memory _requisitos,
        Leccion[] memory _lecciones
    ) external soloAdmin returns (uint256) {
        require(bytes(_titulo).length > 0, "Titulo no puede estar vacio");
        require(bytes(_descripcion).length > 0, "Descripcion no puede estar vacia");
        require(_precio >= 0, "Precio debe ser mayor o igual a 0");

        _cursoIds.increment();
        uint256 nuevoCursoId = _cursoIds.current();

        Curso storage nuevoCurso = cursos[nuevoCursoId];
        nuevoCurso.id = nuevoCursoId;
        nuevoCurso.titulo = _titulo;
        nuevoCurso.nivel = _nivel;
        nuevoCurso.duracion = _duracion;
        nuevoCurso.imagen = _imagen;
        nuevoCurso.descripcion = _descripcion;
        nuevoCurso.instructor = _instructor;
        nuevoCurso.precio = _precio;
        nuevoCurso.estudiantes = 0;
        nuevoCurso.rating = 0;
        nuevoCurso.categorias = _categorias;
        nuevoCurso.requisitos = _requisitos;
        nuevoCurso.creador = msg.sender;
        nuevoCurso.activo = true;
        nuevoCurso.fechaCreacion = block.timestamp;

        // Agregar lecciones
        for (uint i = 0; i < _lecciones.length; i++) {
            nuevoCurso.lecciones.push(_lecciones[i]);
        }

        cursosPorCreador[msg.sender].push(nuevoCursoId);

        emit CursoCreado(nuevoCursoId, _titulo, msg.sender);
        return nuevoCursoId;
    }

    /**
     * @dev Comprar acceso a un curso
     */
    function comprarCurso(uint256 _cursoId) external payable cursoExiste(_cursoId) cursoActivo(_cursoId) nonReentrant {
        Curso storage curso = cursos[_cursoId];
        require(msg.value >= curso.precio, "Pago insuficiente");
        require(!tieneAcceso[msg.sender][_cursoId], "Ya tienes acceso a este curso");

        // Crear la compra
        _compraIds.increment();
        uint256 compraId = _compraIds.current();

        Compra storage nuevaCompra = compras[compraId];
        nuevaCompra.cursoId = _cursoId;
        nuevaCompra.comprador = msg.sender;
        nuevaCompra.precio = curso.precio;
        nuevaCompra.fechaCompra = block.timestamp;
        nuevaCompra.activa = true;

        // Actualizar estadísticas del curso
        curso.estudiantes++;

        // Dar acceso al usuario
        tieneAcceso[msg.sender][_cursoId] = true;
        comprasPorUsuario[msg.sender].push(compraId);

        emit CursoComprado(_cursoId, msg.sender, curso.precio);
    }

    /**
     * @dev Obtener información de un curso
     */
    function obtenerCurso(uint256 _cursoId) external view cursoExiste(_cursoId) returns (
        uint256 id,
        string memory titulo,
        string memory nivel,
        string memory duracion,
        string memory imagen,
        string memory descripcion,
        string memory instructor,
        uint256 precio,
        uint256 estudiantes,
        uint256 rating,
        string[] memory categorias,
        string memory requisitos,
        Leccion[] memory lecciones,
        address creador,
        bool activo,
        uint256 fechaCreacion
    ) {
        Curso storage curso = cursos[_cursoId];
        return (
            curso.id,
            curso.titulo,
            curso.nivel,
            curso.duracion,
            curso.imagen,
            curso.descripcion,
            curso.instructor,
            curso.precio,
            curso.estudiantes,
            curso.rating,
            curso.categorias,
            curso.requisitos,
            curso.lecciones,
            curso.creador,
            curso.activo,
            curso.fechaCreacion
        );
    }

    /**
     * @dev Verificar si un usuario tiene acceso a un curso
     */
    function verificarAcceso(address _usuario, uint256 _cursoId) external view returns (bool) {
        return tieneAcceso[_usuario][_cursoId];
    }

    /**
     * @dev Obtener todos los cursos activos
     */
    function obtenerCursosActivos() external view returns (uint256[] memory) {
        uint256 totalCursos = _cursoIds.current();
        uint256[] memory cursosActivos = new uint256[](totalCursos);
        uint256 contador = 0;

        for (uint256 i = 1; i <= totalCursos; i++) {
            if (cursos[i].activo) {
                cursosActivos[contador] = i;
                contador++;
            }
        }

        // Redimensionar el array al tamaño real
        uint256[] memory resultado = new uint256[](contador);
        for (uint256 i = 0; i < contador; i++) {
            resultado[i] = cursosActivos[i];
        }

        return resultado;
    }

    /**
     * @dev Obtener cursos por creador
     */
    function obtenerCursosPorCreador(address _creador) external view returns (uint256[] memory) {
        return cursosPorCreador[_creador];
    }

    /**
     * @dev Obtener compras por usuario
     */
    function obtenerComprasPorUsuario(address _usuario) external view returns (uint256[] memory) {
        return comprasPorUsuario[_usuario];
    }

    /**
     * @dev Actualizar curso (solo creador o admin)
     */
    function actualizarCurso(
        uint256 _cursoId,
        string memory _titulo,
        string memory _nivel,
        string memory _duracion,
        string memory _imagen,
        string memory _descripcion,
        string memory _instructor,
        uint256 _precio,
        string[] memory _categorias,
        string memory _requisitos,
        Leccion[] memory _lecciones
    ) external cursoExiste(_cursoId) {
        Curso storage curso = cursos[_cursoId];
        require(msg.sender == curso.creador || admins[msg.sender] || msg.sender == owner(), 
                "Solo el creador o admin puede actualizar el curso");

        curso.titulo = _titulo;
        curso.nivel = _nivel;
        curso.duracion = _duracion;
        curso.imagen = _imagen;
        curso.descripcion = _descripcion;
        curso.instructor = _instructor;
        curso.precio = _precio;
        curso.categorias = _categorias;
        curso.requisitos = _requisitos;

        // Actualizar lecciones
        delete curso.lecciones;
        for (uint i = 0; i < _lecciones.length; i++) {
            curso.lecciones.push(_lecciones[i]);
        }

        emit CursoActualizado(_cursoId);
    }

    /**
     * @dev Eliminar curso (solo creador o admin)
     */
    function eliminarCurso(uint256 _cursoId) external cursoExiste(_cursoId) {
        Curso storage curso = cursos[_cursoId];
        require(msg.sender == curso.creador || admins[msg.sender] || msg.sender == owner(), 
                "Solo el creador o admin puede eliminar el curso");

        curso.activo = false;
        emit CursoEliminado(_cursoId);
    }

    /**
     * @dev Agregar admin
     */
    function agregarAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
        emit AdminAgregado(_admin);
    }

    /**
     * @dev Remover admin
     */
    function removerAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
        emit AdminRemovido(_admin);
    }

    /**
     * @dev Retirar fondos del contrato (solo owner)
     */
    function retirarFondos() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");
        
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Obtener estadísticas del contrato
     */
    function obtenerEstadisticas() external view returns (
        uint256 totalCursos,
        uint256 totalCompras,
        uint256 balance
    ) {
        return (
            _cursoIds.current(),
            _compraIds.current(),
            address(this).balance
        );
    }

    // Función para recibir ETH
    receive() external payable {}
} 