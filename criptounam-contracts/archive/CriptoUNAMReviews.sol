// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CriptoUNAMReviews
 * @dev Contrato para manejar reviews y calificaciones de cursos
 */
contract CriptoUNAMReviews is Ownable {
    using Counters for Counters.Counter;

    // Estructuras de datos
    struct Review {
        uint256 id;
        uint256 cursoId;
        address reviewer;
        uint256 rating; // 1-5 estrellas
        string comentario;
        uint256 fechaCreacion;
        bool activa;
    }

    struct CursoStats {
        uint256 totalReviews;
        uint256 ratingPromedio;
        uint256[] ratings; // Array de ratings individuales
    }

    // Variables de estado
    Counters.Counter private _reviewIds;
    
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => CursoStats) public cursoStats; // cursoId => stats
    mapping(address => uint256[]) public reviewsPorUsuario;
    mapping(uint256 => uint256[]) public reviewsPorCurso;

    // Eventos
    event ReviewCreada(uint256 indexed reviewId, uint256 indexed cursoId, address indexed reviewer, uint256 rating);
    event ReviewActualizada(uint256 indexed reviewId);
    event ReviewEliminada(uint256 indexed reviewId);

    // Modificadores
    modifier soloConAcceso(uint256 _cursoId) {
        // Aquí deberías verificar si el usuario tiene acceso al curso
        // Por ahora asumimos que cualquiera puede hacer review
        _;
    }

    modifier reviewExiste(uint256 _reviewId) {
        require(reviews[_reviewId].id != 0, "Review no existe");
        _;
    }

    modifier reviewActiva(uint256 _reviewId) {
        require(reviews[_reviewId].activa, "Review no esta activa");
        _;
    }

    /**
     * @dev Crear una nueva review
     */
    function crearReview(
        uint256 _cursoId,
        uint256 _rating,
        string memory _comentario
    ) external soloConAcceso(_cursoId) returns (uint256) {
        require(_rating >= 1 && _rating <= 5, "Rating debe estar entre 1 y 5");
        require(bytes(_comentario).length > 0, "Comentario no puede estar vacio");

        _reviewIds.increment();
        uint256 nuevoReviewId = _reviewIds.current();

        Review storage nuevaReview = reviews[nuevoReviewId];
        nuevaReview.id = nuevoReviewId;
        nuevaReview.cursoId = _cursoId;
        nuevaReview.reviewer = msg.sender;
        nuevaReview.rating = _rating;
        nuevaReview.comentario = _comentario;
        nuevaReview.fechaCreacion = block.timestamp;
        nuevaReview.activa = true;

        // Actualizar estadísticas del curso
        _actualizarStatsCurso(_cursoId, _rating);

        // Agregar a las listas
        reviewsPorUsuario[msg.sender].push(nuevoReviewId);
        reviewsPorCurso[_cursoId].push(nuevoReviewId);

        emit ReviewCreada(nuevoReviewId, _cursoId, msg.sender, _rating);
        return nuevoReviewId;
    }

    /**
     * @dev Actualizar una review existente
     */
    function actualizarReview(
        uint256 _reviewId,
        uint256 _rating,
        string memory _comentario
    ) external reviewExiste(_reviewId) reviewActiva(_reviewId) {
        Review storage review = reviews[_reviewId];
        require(msg.sender == review.reviewer, "Solo el autor puede actualizar la review");
        require(_rating >= 1 && _rating <= 5, "Rating debe estar entre 1 y 5");
        require(bytes(_comentario).length > 0, "Comentario no puede estar vacio");

        // Actualizar stats del curso (remover rating anterior y agregar nuevo)
        _actualizarStatsCurso(review.cursoId, _rating, review.rating);

        review.rating = _rating;
        review.comentario = _comentario;

        emit ReviewActualizada(_reviewId);
    }

    /**
     * @dev Eliminar una review
     */
    function eliminarReview(uint256 _reviewId) external reviewExiste(_reviewId) reviewActiva(_reviewId) {
        Review storage review = reviews[_reviewId];
        require(msg.sender == review.reviewer || msg.sender == owner(), 
                "Solo el autor o owner puede eliminar la review");

        review.activa = false;

        // Actualizar stats del curso (remover rating)
        _actualizarStatsCurso(review.cursoId, 0, review.rating);

        emit ReviewEliminada(_reviewId);
    }

    /**
     * @dev Obtener información de una review
     */
    function obtenerReview(uint256 _reviewId) external view reviewExiste(_reviewId) returns (
        uint256 id,
        uint256 cursoId,
        address reviewer,
        uint256 rating,
        string memory comentario,
        uint256 fechaCreacion,
        bool activa
    ) {
        Review storage review = reviews[_reviewId];
        return (
            review.id,
            review.cursoId,
            review.reviewer,
            review.rating,
            review.comentario,
            review.fechaCreacion,
            review.activa
        );
    }

    /**
     * @dev Obtener estadísticas de un curso
     */
    function obtenerStatsCurso(uint256 _cursoId) external view returns (
        uint256 totalReviews,
        uint256 ratingPromedio,
        uint256[] memory ratings
    ) {
        CursoStats storage stats = cursoStats[_cursoId];
        return (
            stats.totalReviews,
            stats.ratingPromedio,
            stats.ratings
        );
    }

    /**
     * @dev Obtener reviews por curso
     */
    function obtenerReviewsPorCurso(uint256 _cursoId) external view returns (uint256[] memory) {
        return reviewsPorCurso[_cursoId];
    }

    /**
     * @dev Obtener reviews por usuario
     */
    function obtenerReviewsPorUsuario(address _usuario) external view returns (uint256[] memory) {
        return reviewsPorUsuario[_usuario];
    }

    /**
     * @dev Actualizar estadísticas de un curso
     */
    function _actualizarStatsCurso(uint256 _cursoId, uint256 _nuevoRating, uint256 _ratingAnterior) internal {
        CursoStats storage stats = cursoStats[_cursoId];
        
        if (_ratingAnterior > 0) {
            // Actualizar rating existente
            uint256 totalRating = stats.ratingPromedio * stats.totalReviews;
            totalRating = totalRating - _ratingAnterior + _nuevoRating;
            stats.ratingPromedio = totalRating / stats.totalReviews;
        } else {
            // Agregar nuevo rating
            stats.totalReviews++;
            uint256 totalRating = stats.ratingPromedio * (stats.totalReviews - 1) + _nuevoRating;
            stats.ratingPromedio = totalRating / stats.totalReviews;
            stats.ratings.push(_nuevoRating);
        }
    }

    /**
     * @dev Actualizar estadísticas de un curso (sobrecarga para nuevos ratings)
     */
    function _actualizarStatsCurso(uint256 _cursoId, uint256 _rating) internal {
        _actualizarStatsCurso(_cursoId, _rating, 0);
    }

    /**
     * @dev Obtener estadísticas generales
     */
    function obtenerEstadisticas() external view returns (
        uint256 totalReviews,
        uint256 totalCursosConReviews
    ) {
        return (
            _reviewIds.current(),
            0 // TODO: Implementar contador de cursos con reviews
        );
    }
} 