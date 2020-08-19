let books = [];

// add an element to the list with the form
// The element is added on the list
// reset the form after submission

// Not add an empty element
// delete an element

// edit the state of an element

// save new element to local storage
// save the new state of object in local storage

const tableList = document.querySelector('tbody');
const form = document.querySelector('form');

const showBooks = () => {
	console.info('showing the list again');
	const html = books
		.map(book => {
			return `
                <tr>
                    <td class="left">${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre}</td>
                    <td>${book.pages}</td>
                    <td>
                        <button value="${book.id}" 
                            class="check" 
                            aria-label="Update read attribute of ${book.title}">
                            <input type="checkbox" ${book.read ? 'checked' : ''} />
                        </button>
                    </td>
                    <td>
                        <button 
                            data-book="${book.id}"
                            class="delete" 
                            aria-label="Delete book ${book.title}">
                            <img 
                                src="./assets/icons/trash.svg" 
                                alt="Delete ${book.title} from the list">
                        </button>
                    </td>
                </tr>
            `;
		})
		.join('');
	tableList.innerHTML = html;
};

const addBook = e => {
	e.preventDefault();
	const formEl = e.currentTarget;
	// form validation?
	// check if the name is at least a few characters
	// check if the book already exist in the library
	const newBook = {
		title: formEl.title.value,
		author: formEl.author.value,
		genre: formEl.genre.value,
		pages: formEl.pages.value,
		read: formEl.read.checked,
		id: Date.now(), // 12313687678
	};
	console.log(books);
	books.push(newBook);
	tableList.dispatchEvent(new CustomEvent('listUpdated'));
	// showBooks();
	// updateLocalStorage();
	formEl.reset();
};

// event delegation
const handleClick = e => {
	// update read attribute
	const checkBtn = e.target.closest('button.check');
	// if the check button was clicked
	if (checkBtn) {
		const id = Number(checkBtn.value);
		updateRead(id);
	}
	const deleteBtn = e.target.closest('button.delete');
	// if the delete button was clicked
	if (deleteBtn) {
		const id = Number(deleteBtn.dataset.book);
		console.log(id);
		deleteBook(id);
	}
};

const deleteBook = idToDelete => {
	books = books.filter(book => book.id !== idToDelete);
	tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

const updateRead = idFromTheButton => {
	const bookToUpdate = books.find(book => book.id === idFromTheButton);
	// objects and arrays are passed by reference (and not by value)
	bookToUpdate.read = !bookToUpdate.read;
	// if we just update the attribute here, it will also be updated to the books object
	tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

// when we reload, we want to look inside the local storage and put them into books
const initLocalStorage = () => {
	// JSON parse will change a string into an object (if it's well structured)
	const booksLs = JSON.parse(localStorage.getItem('books'));
	console.log('hello', booksLs);
	if (booksLs) {
		books = booksLs;
	}
	tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

// we want to update the local storage each time we update, delete or add an attirbute
const updateLocalStorage = () => {
	console.log('saving books array into local storage');
	localStorage.setItem('books', JSON.stringify(books));
};

form.addEventListener('submit', addBook);
tableList.addEventListener('listUpdated', showBooks);
tableList.addEventListener('listUpdated', updateLocalStorage);
tableList.addEventListener('click', handleClick);

initLocalStorage();
