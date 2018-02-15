// JavaScript Document
function Pantalla() {

    this.inicia = iniciar;
    this.activaBoton = activarBoton;
    this.getCombos = getCombos;
    this.armarCombos = armarCombos;
    var footer = new Footer();
    var itemsDataCombosALL = { "productos": [] };

    function iniciar() {

        //Menú Principal
        var menuPrincipal = new MenuPrincipal();
        footer.salir();

        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            nextButton: '#arrow_swiper_right',
            prevButton: '#arrow_swiper_left',
            paginationBulletRender: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            }
        });

        $('.boton-productos').click(function () {
            var MRCBloqueados = parent._MRCBloqueados.split(",");
            var estaBloqueado = false;
            for (var j = 0; j < MRCBloqueados.length; j++) {
                if ($(this).attr('id') == MRCBloqueados[j]) {
                    estaBloqueado = true;
                    break;
                }
            }
            if (estaBloqueado) {
                parent.solicitaCambioEstadoMRC("desbloquear", $(this).attr('id'));
            } else {
                parent.solicitaCambioEstadoMRC("bloquear", $(this).attr('id'));
            }
        });
    }

    function getCombos() {
        dataComboAProcesar = parent._dataWSMaestro.split("\n");
        var oFunArchivo = new parent.parent.parent.FuncionesArch();
        for (i = 0; i < dataComboAProcesar.length; i++) {
            dataTemp = dataComboAProcesar[i].split(",");
            if (dataTemp[0] == "COMBO") {
                var existe = oFunArchivo.existeArchivo("C:/Program Files/Aplicaciones DTS/Publicidad/Productos", dataTemp[4]);

                if (existe) {
                    imagen = "../../../Publicidad/Productos/" + dataTemp[4] + "";
                } else {
                    imagen = "../SelProductos/Pantalla2/img/ImagenNoDisponible.jpg";
                }

                itemsDataCombosALL.productos.push({ "nombre": dataTemp[3]
                                , "localMRC": dataTemp[1]
                                , "codigoMRC": dataTemp[2]
                                , "descripcion": dataTemp[3]
                                , "foto": imagen
                                , "precio": dataTemp[5]
                                , "observaciones": dataTemp[6]
                                , "agrupacion": dataTemp[7]
                });
            }
        }
    }

    function armarCombos() {
        $('.swiper-wrapper').empty();
        items = itemsDataCombosALL;
        var combosPorPantalla = 12;
        var total = items.productos.length;
        var cantidadDeSlides = Math.ceil(total / combosPorPantalla);

		for (var j = 0; j < cantidadDeSlides; j++) {
		    $('.swiper-wrapper').append('<div id="swiper_slide_' + j + '" class="swiper-slide"><div class="lista"></div>');
		    var partoDesde = j * combosPorPantalla;
		    var llegoHasta = partoDesde + combosPorPantalla;
		    for (var i = partoDesde; i < llegoHasta; i++) {
		        if (i >= total) {
		            break;
		        }
		        $('#swiper_slide_' + j + ' .lista').append('<div id="' + items.productos[i].codigoMRC + '" class="boton-productos"><img src="' + items.productos[i].foto + '" height="112" width="220"><span>' + items.productos[i].observaciones + '</span></div>');
			} 
		}
    }
}

//activar o desactivar botón: true o false
function activarBoton(bool, btn) {
    if (bool) {
        TweenLite.to(btn, 0.5, { opacity: 1, ease: Expo.easeOut });
    }
    else {
        TweenLite.to(btn, 0.5, { opacity: 0.5, ease: Expo.easeOut });
    }
}

function actualizaEstadoCombos(listaMRC) {
    try {
        var todosLosCombos = document.getElementsByClassName("boton-productos");
        var MRCBloqueados = new Array();
        MRCBloqueados = listaMRC.split(",");
        for (var i = 0; i < todosLosCombos.length; i++) {
            var seDebeBloquear = false;
            for (var j = 0; j < MRCBloqueados.length; j++) {
                if (todosLosCombos[i].id == MRCBloqueados[j]) {
                    seDebeBloquear = true;
                    break;
                }
            }
            activarBoton(!seDebeBloquear, $('#' + todosLosCombos[i].id));
        }
    } catch (err) {
        var exc = err;
    }
}