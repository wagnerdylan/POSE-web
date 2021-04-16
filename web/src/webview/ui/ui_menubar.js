import { web_camera, web_view, tracking_enum } from '../webview.js';

var init_ui_menu = function () {
    $("#menu").mousedown(function (evt) {
        evt.stopImmediatePropagation();
        return false;
    });
    $('#menu').menu({ position: { at: "left bottom" } });
    $("#menu #focus-sun-menu-ui").click(function () {
        web_camera.set_tracking(tracking_enum.SUN);
    });
    $("#menu #focus-earth-menu-ui").click(function () {
        web_camera.set_tracking(tracking_enum.EARTH);
    });
    $("#menu #focus-moon-menu-ui").click(function () {
        web_camera.set_tracking(tracking_enum.MOON);
    });
    $("#menu #about-menu-ui").click(function () {
        console.log("About");
    });
}

export { init_ui_menu };
