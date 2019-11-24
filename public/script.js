async function showcars(){
    let response = await fetch(`api/cars/`);
    let cars = await response.json();
    let carsDiv = document.getElementById("cars");
    carsDiv.innerHTML = "";


    console.log(cars)
    for(i in cars){
        carsDiv.appendChild(getcarElem(cars[i]));
    }
}

function getcarElem(car){
    let carDiv = document.createElement("div");
    carDiv.classList.add("car");
    let carContentDiv = document.createElement("div");
    carContentDiv.classList.add("car-content");
    carDiv.append(carContentDiv);

    //create a link to expand and contract the car details
    let carHeading = document.createElement("div");
    let carA = document.createElement("a");
    let carH3 = document.createElement("h3");
    carA.append(carH3);
    carA.onclick = expandcar;
    carA.setAttribute("href", "#");
    carA.setAttribute("data-id", car._id);
    carH3.innerHTML = car.title;
    carHeading.append(carA);
    carHeading.classList.add('car-heading');
    carHeading.append(getcarButtons(car));
    carContentDiv.append(carHeading);
    carContentDiv.appendChild(getcarExpand(car));
    return carDiv;
}

function getcarButtons(car){
    let buttonsDiv = document.createElement("div");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    deleteButton.innerHTML = "Delete";
    editButton.setAttribute("data-id", car._id);
    deleteButton.setAttribute("data-id", car._id);
    editButton.onclick = showEditForm;
    deleteButton.onclick = deletecar;
    buttonsDiv.append(editButton);
    buttonsDiv.append(deleteButton);
    return buttonsDiv;
}

async function showEditForm(){
    let carId = this.getAttribute("data-id");
    document.getElementById("edit-car-id").textContent = carId;

    let response = await fetch(`api/cars/${carId}`);

    if(response.status != 200){
        showError("Error Displaying car");
        return;
    }

    let car = await response.json();
    document.getElementById('txt-edit-car-make').value = car.make;
    document.getElementById("txt-edit-car-model").value=car.model;
    document.getElementById("txt-edit-car-hp").value=car.hp;
    document.getElementById('txt-edit-car-price').value = car.price;
    document.getElementById("txt-edit-car-trims").value=car.trim;
    document.getElementById("txt-edit-car-truck").value=car.truck;
    if(car.trim != null){
        document.getElementById("txt-edit-car-trims").value = car.trim.join('\n');
    }
}

async function deletecar(){
    //clearError();
    let carId = this.getAttribute('data-id');

    let response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });
    if(response.status != 200){
        //showError("Error deleting car");
        console.log("Error deleting car");
        return;
    }
    
    let result = await response.json();
    console.log("successful delete");
    showcars();
}

function getcarExpand(car){
    //add the car details
    carExpand = document.createElement("div");
    carExpand.setAttribute("id", car._id);
    carExpand.classList.add("hidden");
    makeP = document.createElement('p');
    makeP.innerHTML = `<b>Make: </b> ${car.make}`;
    modelP = document.createElement("p");
    modelP.innerHTML = `<b>Model: </b> ${car.model}`;
    hpP = document.createElement("p");
    hpP.innerHTML = `<b>Horsepower: </b> ${car.hp}`;
    priceP = document.createElement("p");
    priceP.innerHTML = `<b>Price: </b> ${car.price}`;
    
    carExpand.append(makeP);
    carExpand.append(modelP);
    carExpand.append(hpP);
    carExpand.append(priceP);
    carExpand.append(getTrimsElement(car));
    carExpand.append(getTruckElement(car));
    return carExpand;
}

function getTrimsElement(car){
    return getArrayInfo("Trims: ", car.trim);
}

function getTruckElement(car){
    if(car.truck == false){
        return "not a truck"
    }
    else
        return "is a truck"
}

function getArrayInfo(title, list){
    let divContent = document.createElement("div");
    let divTitle = document.createElement("h4");
    divTitle.innerHTML = title + ": ";
    divContent.append(divTitle);

    let ulElem = document.createElement("ul");
    for(i in list){
        liElem = document.createElement("li");
        liElem.innerHTML = list[i];
        ulElem.append(liElem);
    }
    divContent.append(ulElem);
    return divContent;
}

function expandcar()
{
    let expandId = this.getAttribute("data-id");
    let expandElem = document.getElementById(expandId);
    expandElem.classList.toggle("hidden");
    return false;
}


async function addcar(){
    const make = document.getElementById("txt-add-car-make").value;
    const model = document.getElementById("txt-add-car-model").value;
    const hp = document.getElementById("txt-add-car-hp").value;
    const price = document.getElementById("txt-add-car-price").value;
    const trims = document.getElementById("txt-add-car-trims").value;
    const truck = document.getElementById("txt-add-car-truck").value;
    const feedbackP = document.getElementById("add-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let car = {"make": make, "model": model, "hp": hp, "price": price, "trims":trims, "truck":truck};
    console.log(car);

    let response = await fetch('/api/cars/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(car),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Adding car";
        feedbackP.classList.add("error");
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Added car";
    feedbackP.classList.add("success");
    showcars();
}

async function editcar(){
    const id = document.getElementById("edit-car-id").textContent;
    const make = document.getElementById("txt-edit-car-make").value;
    const model = document.getElementById("txt-edit-car-model").value;
    const hp = document.getElementById("txt-edit-car-hp").value;
    const price = document.getElementById("txt-edit-car-price").value;
    const trims = document.getElementById("txt-edit-car-trims").value;
    const truck = document.getElementById("txt-edit-car-truck").value;
    const feedbackP = document.getElementById("edit-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let car = {"make": make, "model": model, "hp": hp, "price": price, "trims":trims, "truck":truck};
    console.log(car);

    let response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(car),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Editing car";
        feedbackP.classList.add("error");
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Editted car";
    feedbackP.classList.add("success");
    showcars();
}

window.onload = function(){
    this.document.getElementById("btn-add-car").onclick = addcar;
    this.showcars();

    this.document.getElementById("btn-edit-car").onclick = editcar;
}