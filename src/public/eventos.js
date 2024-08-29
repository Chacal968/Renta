/*var selPro = document.getElementById('Provincia');

const selPro = document.querySelector('#Provincia');
const SelPolo = document.querySelector('#Polo');


selPro.addEventListener('change', PoblarPolosTur);
*/

// Obtener el id de la provincia y poblar el polo turistico con el id seleccionado.
var selProv = document.getElementById('SelProvincia');
selProv.addEventListener('change', function () {
    const provinciaId = selProv.value;
    console.log(`Evento capturado: ${provinciaId}`);

    if (provinciaId) {
        $.ajax({
            url: '/get-polotur',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: provinciaId }),
            success: function(data) {
                document.getElementById('SelPolo').innerHTML = data;
            }
        });
    }
});

// Obtener el id de la provincia y poblar el polo turistico con el id seleccionado.
var btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', function () {
    const provinciaId = selProv.value;
    console.log(`Evento capturado: ${provinciaId}`);

    if (provinciaId) {
        $.ajax({
            url: '/get-polotur',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: provinciaId }),
            success: function(data) {
                document.getElementById('SelPolo').innerHTML = data;
            }
        });
    }
});

/*  Otra forma de capturar el evento
 $(document).ready(function() {
    $('#SelProvincia').change(function() {
        const provinciaId = $(this).val();
        console.log('Capturó el evento');
        if (provinciaId) {
            
            $.ajax({
                url: '/get-polotur',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: provinciaId }),
                success: function(data) {
                    $('#SelPolo').html(data);
                }
            });
        }
    });
});
*/