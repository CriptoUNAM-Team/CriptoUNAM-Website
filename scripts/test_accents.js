const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
console.log(normalize("Introducción").includes(normalize("introduccion")));
