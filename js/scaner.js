document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'Scaner',
		B = window.plus.bridge;
    var Scaner =
    {
        getCode : function (Argus)
        {
            return B.execSync(_BARCODE, "getCode", [Argus]);
        },
        initMe : function (Argus)
        {
            return B.execSync(_BARCODE, "initMe", [Argus]);
        },
    };
    window.plus.Scaner = Scaner;
}, true );