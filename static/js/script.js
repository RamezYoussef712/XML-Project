// input fields:
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const emailInput = document.getElementById('email');
const form = document.getElementById('form-data');
// 
const resultHeader = document.getElementById('error');
// buttons:
const resetButton = document.getElementById('reset');
const searchButton = document.getElementById('search');
const deleteButton = document.getElementById('delete');
const updateButton = document.getElementById('update');

updateButton.disabled = true;

let url = window.location.href;
let query = url.split('?');
console.log(query);
if(query.length > 1){
    resultHeader.innerHTML = "Employee inserted successfully!";
}

const searchByName = (e) => {
    e.preventDefault();
    fetch(`/search?name=${nameInput.value}`)
        .then(r => r.json())
        .then((r) => {
            if (r.name === '') {
                resultHeader.innerHTML = 'Employee not found!';
            } else {
                nameInput.value = r.name;
                nameInput.disabled = true;
                phoneInput.value = r.phone;
                addressInput.value = r.address;
                emailInput.value = r.email;
                resultHeader.innerHTML = '';
                updateButton.disabled = false;
            }
        })
        .catch()
}
searchButton.addEventListener('click', searchByName);

const deleteContact = (e) => {
    e.preventDefault();
    fetch(`/delete?name=${nameInput.value}`)
        .then(r => r.json())
        .then((r) => {
            if (r.response === 'error') {
                resultHeader.innerHTML = 'Employee not found!';
            } else {
                resultHeader.innerHTML = 'Employee deleted Successfully!'
            }
        })
}
deleteButton.addEventListener('click', deleteContact);

const updateContact = (e) => {
    e.preventDefault();
    let data =
        {
            name: nameInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
            email: emailInput.value
        }

    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then((r) => {
        if (r.response === 'error') {
            resultHeader.innerHTML = 'Employee Could not be updated!';
        } else {
            resultHeader.innerHTML = 'Employee updated Successfully!'
        }
    })
    // .catch(err => {
    //     // Handle error
    //     console.log('Error message: ', error);
    // });
}

//     fetch(`/update`)
//     .then(r => r.json())
//     .then((r) => {
//         if(r.resposnse === 'error') {
//             resultHeader.innerHTML = 'Employee not found!'
//         } else {
//             resultHeader.innerHTML = 'Employee updated Successfully!'
//         }
//     })
// }
document.getElementById('update').addEventListener('click', updateContact);

resetButton.addEventListener('click', () => {
    resultHeader.innerHTML = '';
    window.location.href = query[0];
})

