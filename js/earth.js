/**
 * reference: https://github.com/dataarts/webgl-globe
 * credits: texture designed by Nitish
 * 
 * Texture:
 * change the earth texture at line 130 @lib/globle.js
 * change the point texture at line 300 @lib/globle.js
 * 
 * data format:
 * 
 * var data = [
 *      [
 *      'seriesA', [ latitude, longitude, magnitude, latitude, longitude, magnitude, ... ]
 *      ],
 *      [
 *      'seriesB', [ latitude, longitude, magnitude, latitude, longitude, magnitude, ... ]
 *      ]
 * ];
 * 
 */

window.onload = function () {
    init();
};

function init() {
    let container = document.getElementById('container');

    // Make the globe
    let globe = new DAT.Globe(container);
    let xhr = new XMLHttpRequest();

    // Where do we get the data?
    xhr.open('GET', 'https://wenqili.github.io/three-data-boilerplate/data/airData.json', true);

    // What do we do when we have it?
    xhr.onreadystatechange = () => {

        // If we've received the data
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Parse the JSON

            var data = JSON.parse( xhr.responseText );
         
            for (var i = 0; i < data.length; i++) {
                globe.addData(data[i][1], {
                    format: 'magnitude',
                    name: data[i][0]
                });
            }

            // Create the geometry
            globe.createPoints();

            // Begin animation
            globe.animate();

        }

    };

    // Begin request
    xhr.send(null);
}
