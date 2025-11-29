document.getElementById("load-photos").addEventListener("click", function () {
    const dateSelected = document.getElementById("select-date").value;
    const errorContainer = document.getElementById("error-container");
    const errorMessage = document.createElement('p');
    errorContainer.innerHTML = "";

    if (dateSelected) {
        const heading = document.getElementById("photos-heading");
        if (heading) {
            heading.textContent = `Photos from ${dateSelected}`;
        }
        displayMarsPhotos(dateSelected).then(photos => {
            errorContainer.innerHTML = "";

            if (photos.length > 0) {

                retrievePhotos(photos, `Photos from ${dateSelected}`);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = "No photos found for the selected date.";
                errorMessage.classList.add('error-message');
                errorContainer.appendChild(errorMessage);
                console.log("No photos found for the selected date.");

            }
        });
    } else {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Please select a date.";
        errorMessage.classList.add('error-message');
        errorContainer.appendChild(errorMessage);
        console.log("Please select a date.");
    }
});

// Function displayMarsPhotos
async function displayMarsPhotos(earth_date) {
    try {
        const apiKey = "mhp3nPZpTYgEBcSEQTbTmkGGDl3eSzINKInRYJR6";
        const urlNasaApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${earth_date}&api_key=${apiKey}`;
        const request = await fetch(urlNasaApi);

        console.log(request);

        if (!request.ok) {
            throw new Error(`Failed to fetch data. Error: ${request.status}`);
        }
        const response = await request.json();
        if (response.photos.length === 0 || !response.photos || !response) {
            throw new Error(`No photos found for this particular date: ${earth_date}. You should try a different date.`);
        }
        console.log(response); // Checking the response

        const photos = response.photos.slice(0, 3).map(({ img_src, earth_date, sol, camera }) => ({
            image: img_src,
            date: earth_date,
            sol: sol,
            cameraName: camera.name
        }));

        return photos;
    }
    catch (e) {
        console.log("An error occurred:", e);
        return [];
    }
}

// Calling function displayMarsPhotos and retrievePhotos
displayMarsPhotos("2015-09-28").then(photos => {
    console.log(photos);
    retrievePhotos(photos, "");

});

// Function retrievePhotos
function retrievePhotos(photos, description) {
    const photoGallery = document.getElementById("photo-gallery");
    console.log(`working=${photoGallery}`);
    photoGallery.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = description;
    heading.id = "photos-heading";
    photoGallery.appendChild(heading);

    photos.forEach(photo => {
        const imageTag = document.createElement("img");
        imageTag.src = photo.image;
        imageTag.alt = "Mars Rover Photo";

        const caption = document.createElement("p");
        caption.id = "captionId";
        caption.textContent = `Date: ${photo.date}, Camera: ${photo.cameraName}`;
        photoGallery.appendChild(imageTag);
        photoGallery.appendChild(caption);

    });
}