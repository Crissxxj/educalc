// EduCalc - Calculadora de Promedio Estudiantil

// --- VARIABLES ---
var contador = 0;                  // número: lleva el conteo de materias
var NOTA_MINIMA = 7;               // número: nota mínima para aprobar

// --- FUNCIÓN: Agregar una materia al formulario ---
function agregarMateria() {
  contador++;
  var fila = '<div class="materia-row" id="mat-' + contador + '">' +
    '<input type="text" class="input-materia" placeholder="Nombre de la materia" />' +
    '<input type="number" class="input-nota" min="0" max="10" step="0.01" placeholder="Nota" />' +
    '<button class="btn-quitar" onclick="quitarMateria(' + contador + ')">✕</button>' +
  '</div>';
  $('#lista-materias').append(fila);  // jQuery: agrega al DOM
}

// --- FUNCIÓN: Quitar una materia ---
function quitarMateria(id) {
  $('#mat-' + id).fadeOut(250, function() { $(this).remove(); }); // jQuery: animación y eliminación
}

// --- FUNCIÓN: Calcular promedio (recibe arreglo, retorna número) ---
function calcularPromedio(notas) {
  var suma = 0;
  for (var i = 0; i < notas.length; i++) {  // ciclo for
    suma += notas[i];
  }
  return parseFloat((suma / notas.length).toFixed(2));
}

// --- FUNCIÓN: Filtrar materias con nota baja (recibe arreglo, retorna arreglo) ---
function materiasBajas(materias) {
  var bajas = [];
  for (var i = 0; i < materias.length; i++) {  // ciclo for
    if (materias[i].nota < NOTA_MINIMA) {        // condicional
      bajas.push(materias[i]);
    }
  }
  return bajas;
}

// --- FUNCIÓN POR EXPRESIÓN: Recolectar datos del formulario ---
var obtenerMaterias = function() {
  var lista = [];
  $('.materia-row').each(function() {  // jQuery: recorre cada fila
    lista.push({
      nombre: $(this).find('.input-materia').val().trim(),
      nota: parseFloat($(this).find('.input-nota').val())
    });
  });
  return lista;
};

// --- FUNCIÓN: Mostrar resultados (llama a otras funciones) ---
function mostrarResultados(nombre, materias) {
  var notas = materias.map(function(m) { return m.nota; }); // arreglo de notas

  var promedio = calcularPromedio(notas);            // llamada a función
  var aprobado = promedio >= NOTA_MINIMA;            // booleano
  var bajas    = materiasBajas(materias);            // llamada a función

  // jQuery: llenar resultados en el DOM
  $('#res-nombre').text(nombre);
  $('#res-promedio').text(promedio.toFixed(2));

  if (aprobado) {  // condicional
    $('#res-estado').text('✅ APROBADO').attr('class', 'estado aprobado');
  } else {
    $('#res-estado').text('❌ REPROBADO').attr('class', 'estado reprobado');
  }

  // Llenar tabla
  var $tbody = $('#tabla-body').empty();
  for (var i = 0; i < materias.length; i++) {
    var clase = materias[i].nota >= NOTA_MINIMA ? 'ok' : 'mal';
    var estado = materias[i].nota >= NOTA_MINIMA ? 'Aprobado' : 'Reprobado';
    $tbody.append(
      '<tr><td>' + materias[i].nombre + '</td>' +
      '<td class="' + clase + '">' + materias[i].nota.toFixed(2) + '</td>' +
      '<td class="' + clase + '">' + estado + '</td></tr>'
    );
  }

  // Mostrar materias bajas si hay
  if (bajas.length > 0) {
    var $ul = $('#lista-bajas').empty();
    for (var j = 0; j < bajas.length; j++) {
      $ul.append('<li>📚 ' + bajas[j].nombre + ' — ' + bajas[j].nota.toFixed(2) + '</li>');
    }
    $('#res-bajas').slideDown(300);
  } else {
    $('#res-bajas').hide();
  }

  // jQuery: ocultar formulario y mostrar resultados
  $('#seccion-form').fadeOut(300, function() {
    $('#seccion-resultado').fadeIn(400).removeClass('oculto');
  });
}

// EVENTOS - jQuery espera a que el DOM esté listo
$(document).ready(function() {

  // Cargar 3 materias por defecto
  agregarMateria(); agregarMateria(); agregarMateria();

  // Clic: agregar materia
  $('#btn-agregar').on('click', agregarMateria);

  // Clic: calcular promedio
  $('#btn-calcular').on('click', function() {
    var nombre   = $('#nombre').val().trim();              // string
    var materias = obtenerMaterias();                      // llamada a función por expresión
    var hayError = false;                                  // booleano

    // Validaciones con condicionales
    if (nombre === '') {
      hayError = true;
      $('#error').text('Ingresa el nombre del estudiante.').removeClass('oculto');
    } else if (materias.length === 0) {
      hayError = true;
      $('#error').text('Agrega al menos una materia.').removeClass('oculto');
    } else {
      for (var i = 0; i < materias.length; i++) {  // ciclo de validación
        if (materias[i].nombre === '' || isNaN(materias[i].nota)) {
          hayError = true;
          $('#error').text('Completa todos los campos de las materias.').removeClass('oculto');
          break;
        }
      }
    }

    if (!hayError) {
      $('#error').addClass('oculto');
      mostrarResultados(nombre, materias);  // llamada a función principal
    }
  });

  // Clic: volver al formulario
  $('#btn-volver').on('click', function() {
    $('#seccion-resultado').fadeOut(300, function() {
      $('#seccion-form').fadeIn(400);
    });
  });

});