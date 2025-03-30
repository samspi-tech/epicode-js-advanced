const USERS_API = 'https://jsonplaceholder.typicode.com/users';

const alertContainer = document.getElementById('alertContainer');
const spinnerContainer = document.getElementById('spinnerContainer');
const tableDataContainer = document.getElementById('tableDataContainer');

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const reloadPageButton = document.getElementById('reloadPageButton');

let objProperty = '';
const filters = document.querySelectorAll('.filter');
const filterButton = document.getElementById('filterButton');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        searchInput.value = '';
        reloadPageButton.classList.remove('d-none');
        objProperty = filterButton.innerText = filter.innerText;
        searchInput.placeholder = `Search for users by their ${objProperty.toLowerCase()}`;
    });
});

const toggleSpinner = () => spinnerContainer.classList.toggle('d-none');

const showAlert = message => {
    alertContainer.innerHTML = message;
    alertContainer.classList.remove('d-none');
};

const getUserData = async () => {
    toggleSpinner();
    try {
        const response = await fetch(USERS_API);
        return await response.json();
    } catch (error) {
        console.error(error);
    } finally {
        toggleSpinner();
    }
};

const generateTableRow = result => {
    const { id, name, username, email, website } = result;
    const tr = document.createElement('tr');

    [id, name, username, email, website].forEach(item => {
        const td = document.createElement('td');
        td.setAttribute('class', 'table-data border');
        td.textContent = item;

        tr.appendChild(td);
    });
    tableDataContainer.appendChild(tr);
};

getUserData()
    .then(results => results.forEach(result => generateTableRow(result)))
    .catch(err => showAlert('Sorry, could not fetch data.'));

const isSearchFiltered = result => {
    objProperty = objProperty.toLowerCase();

    return objProperty !== ''
        ? String(result[objProperty]).toLowerCase()
        : result;
};

const getSearchInputValue = () => searchInput.value.trim().toLowerCase();

const getSearchResults = () => {
    tableDataContainer.innerHTML = '';
    alertContainer.classList.add('d-none');

    getUserData()
        .then(results =>
            results.filter(result => {
                const inputValue = getSearchInputValue();
                const isInputValueEmpty = inputValue === '';
                const userResults = isSearchFiltered(result);

                return isInputValueEmpty
                    ? userResults
                    : userResults.includes(inputValue);
            })
        )
        .then(users => {
            const isUserFound = users.length > 0;
            const userNotFoundMessage = `Sorry, could not find any user with ${objProperty} "${searchInput.value}".`;

            isUserFound
                ? users.forEach(user => generateTableRow(user))
                : showAlert(userNotFoundMessage);
        })
        .catch(err => showAlert('Please, choose a filter.'));
};

const searchPressingEnterKey = e => e.key === 'Enter' && getSearchResults();

searchButton.addEventListener('click', getSearchResults);
document.addEventListener('keydown', searchPressingEnterKey);
