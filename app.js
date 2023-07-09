/*==========BOOK CLASS=======*/

var selectedContainer;
class Book{
    constructor(title, author, pageNumber, series, genre, readStatus, rating, review){
        this.title = title;
        this.author = author;
        this.pageNumber = pageNumber;
        this.series = series;
        this.genre = genre;
        this.readStatus = readStatus;
        this.rating = rating;
        this.review = review;
    }
}

/*=========LIBRARY/DISPLAY CLASS==========*/
class Library {
    static displayBook(){
        let booksArray = Storage.getBooks();
        booksArray.forEach(book => {
            Library.addBook(book);
        })
    }

    static addBook(book){
        const bookCard = bookContainerTemplate.content.cloneNode(true).children[0];
        const bookTitle = bookCard.querySelector('[data-book-title]');
        const bookAuthor = bookCard.querySelector('[data-author]');
        const bookPageNum = bookCard.querySelector('[data-page-number]');
        const bookGenre = bookCard.querySelector('[data-genre]');
        const bookSeries = bookCard.querySelector('[data-series]');
        const bookStatus = bookCard.querySelector('[data-status]');
        const bookRating = bookCard.querySelector('[data-rating]');

        bookTitle.textContent += book.title;
        bookAuthor.textContent += book.author;
        bookPageNum.textContent += book.pageNumber;
        bookGenre.textContent += book.genre;
        bookSeries.textContent += book.series;
        bookStatus.textContent += book.readStatus;
        bookRating.textContent += book.rating;

        bookSection.appendChild(bookCard);

        const seeMoreButton = bookCard.querySelector('[data-see-more]');

        seeMoreButton.addEventListener('click', () => {
            Library.addBookPage(book, bookCard);
            bookPageSection.classList.remove('inactive');
            bookSection.classList.add('inactive');

        })
    }

    static addBookPage(book, bookCard){
        const bookPage = bookPageTemplate.content.cloneNode(true).children[0];
        const bookTitle = bookPage.querySelector('[data-book-title]');
        const bookAuthor = bookPage.querySelector('[data-author]');
        const bookPageNum = bookPage.querySelector('[data-page-number]');
        const bookGenre = bookPage.querySelector('[data-genre]');
        const bookSeries = bookPage.querySelector('[data-series]');
        const bookStatus = bookPage.querySelector('[data-status]');
        const bookRating = bookPage.querySelector('[data-rating]');
        const bookReview = bookPage.querySelector('[data-review]');

        bookTitle.textContent += book.title;
        bookAuthor.textContent += book.author;
        bookPageNum.textContent += book.pageNumber;
        bookGenre.textContent += book.genre;
        bookSeries.textContent += book.series;
        bookStatus.textContent += book.readStatus;
        bookRating.textContent += book.rating;
        bookReview.textContent += book.review;

        const deleteButton = bookPage.querySelector('[data-delete-button]')

        deleteButton.addEventListener('click', e => {
            let value = e.target.parentElement.parentElement;
            Library.removeBook(value, bookCard);
            let bookTitle = e.target.parentElement.parentElement.children[0].children[0].textContent
            Storage.removeBook(bookTitle);

            if(bookSection.classList.contains('inactive')) bookSection.classList.remove('inactive');
            bookPageSection.classList.add('inactive');
            
        })

        const editButton = bookPage.querySelector('[data-edit-button]');
        editButton.addEventListener('click', e => {
            let value = e.target.parentElement.parentElement;
            Form.displayForm(value);
        })
   

        bookPageSection.appendChild(bookPage);
    }

    static removeBook(bookPage, bookCard){
        bookPage.remove();
        bookCard.remove();
    }

    static updateDisplay(buttonValue){
        const bookContainers = document.querySelectorAll('[data-book-container]');
        formSection.classList.add('inactive');
        bookPageSection.classList.add('inactive');
        if(bookSection.classList.contains('inactive')) bookSection.classList.remove('inactive');
        bookContainers.forEach(bookContainer => {
            bookContainer.classList.remove('inactive');
            let readingStatus = bookContainer.children[5].querySelector('[data-status]').textContent.toLowerCase();
            if(readingStatus !== buttonValue) bookContainer.classList.toggle('inactive');
            let series = bookContainer.children[4].querySelector('[data-series]').textContent.toLowerCase();
            if(series === buttonValue) bookContainer.classList.toggle('inactive');
            let bookGenre = bookContainer.children[3].querySelector('[data-genre]').textContent.toLowerCase();
            if(bookGenre === buttonValue) bookContainer.classList.toggle('inactive');
            
        })
    }

    static search(inputValue){
        if(bookSection.classList.contains('inactive')) bookSection.classList.remove('inactive');
        formSection.classList.add('inactive');
        bookPageSection.classList.add('inactive');
        const bookContainers = document.querySelectorAll('[data-book-container]');
        bookContainers.forEach(bookContainer => {
        let bookTitle = bookContainer.querySelector('[data-book-title]').textContent.toLowerCase();
        let authorName = bookContainer.querySelector('[data-author]').textContent.toLowerCase()
        const visible = bookTitle.includes(inputValue) || authorName.includes(inputValue);
        bookContainer.classList.toggle('inactive', !visible);
    })
    }
}
/*==========LOCAL STORAGE CLASS==========*/
class Storage{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
         return books;   
    }

    static addBook(book){
        let books = Storage.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(title){
        let books = Storage.getBooks();
        books.forEach((book, index) => {
            if(book.title === title){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books))
    }

    static updateBook(whatsSelected, data){
        let books = Storage.getBooks();
        books.forEach(book => {
            if(book.title === whatsSelected.children[0].children[0].textContent){
                book.title = data.title;
                book.author = data.author;
                book.pageNumber = data.pageNumber;
                book.series = data.series;
                book.genre = data.genre;
                book.readStatus = data.readStatus;
                book.rating = data.rating;
                book.review = data.review;
        }
    })

    localStorage.setItem('books', JSON.stringify(books))
    window.location.reload();
    }
}

/*===========FORM CLASS=============*/
class Form {
    static getFormData(){
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const pageNumber = document.querySelector('#page-number').value;
        const series = document.querySelector('#series').value;
        const genre = document.querySelector('#genre').value;
        const readStatus = document.querySelector('#read-status').value;
        const rating = document.querySelector('#rating').value;
        const review = document.querySelector('#my-review').value;

        const book = new Book(title, author, pageNumber, series, genre, readStatus, rating, review)
        return book;
    }

    static displayForm(selected){
        selectedContainer = selected;
        if(selectedContainer !== 'new'){
        document.getElementById('title').value = selectedContainer.children[0].children[0].textContent
        document.getElementById('author').value = selectedContainer.children[0].children[1].textContent
        document.getElementById('page-number').value = selectedContainer.children[0].children[2].querySelector('[data-page-number]').textContent;
        document.getElementById('genre').value = selectedContainer.children[0].children[4].querySelector('[data-series]').textContent
        document.getElementById('rating').value = selectedContainer.children[0].children[6].querySelector('[data-rating]').textContent
        document.getElementById('my-review').value = ''
        }
        this.helperFunct();

        bookSection.classList.add('inactive');
        bookPageSection.classList.add('inactive');
        formSection.classList.remove('inactive');
    }

    // need this to pass the selected container
    static helperFunct(){
        let cont = selectedContainer;
        return cont;
    }

    static submitForm(){
        let selected = this.helperFunct();
        let formData = this.getFormData();
        if(selected === 'new'){
            Library.addBook(formData);
            Storage.addBook(formData);
        } else {
            Storage.updateBook(selected, formData);
        }

        formSection.classList.add('inactive');
        bookPageSection.classList.add('inactive');
        bookSection.classList.remove('inactive');
    }
}

/*=========Selectors===========*/
// Template for the book container (on the main page)
const bookContainerTemplate = document.querySelector('[data-book-container-template]');
// Template for the book page (on separate page)
const bookPageTemplate = document.querySelector('[data-book-page-template]');
//Section with all books that we're adding
const bookSection = document.querySelector('[data-all-books-section]');
//Section for the page of each book separately
const bookPageSection = document.querySelector('[data-book-page]')
//Button to add new book (in header)
const addNewBookButton = document.querySelector('[data-add-new-book]');
// Form section card, when you click add new book button it displays the form
const formSection = document.querySelector('[data-form-section]');
// Form selector to which we add an event listener and listen for submit
const form = document.querySelector('[data-form]');
// Filter button in header
const filterButton = document.querySelector('[data-filter-button]');
// List of genres in header
const genreList = document.querySelector('[data-filter-list]');


/*====LEFT NAVBAR====*/
const allBooksAndLogoButtons = document.querySelectorAll('[data-all-books-btn]');

allBooksAndLogoButtons.forEach(button => button.addEventListener('click', () => {
    if(bookSection.classList.contains('inactive'))
    bookSection.classList.remove('inactive');
    formSection.classList.add('inactive');
    bookPageSection.classList.add('inactive');
    const bookContainers = document.querySelectorAll('[data-book-container]');
    bookContainers.forEach(bookContainer => {
        if(bookContainer.classList.contains('inactive'))
        bookContainer.classList.remove('inactive')
    })
}))

/*========Event listeners=======*/

// Display books when the page is loaded
document.addEventListener('DOMContentLoaded', Library.displayBook);

// Add new book button (opens the form)
addNewBookButton.addEventListener('click', () => {
    Form.displayForm('new');
    bookSection.classList.add('inactive');
    formSection.classList.remove('inactive');
    bookPageSection.classList.add('inactive');
})

// Submit form
form.addEventListener('submit', e => {
    e.preventDefault();
    Form.submitForm();
})

/*========LEFT NAVBAR=========*/

const leftNavButtons = document.querySelectorAll('[data-left-nav-btn]');

leftNavButtons.forEach(leftNavButton => leftNavButton.addEventListener('click', () => {
    let value = leftNavButton.value.toLowerCase();
    Library.updateDisplay(value)
}))

filterButton.addEventListener('click', () => {
    genreList.classList.toggle('inactive')
})

const genreButtons = document.querySelectorAll('[data-filter-genre-button]');

genreButtons.forEach(genreButton => genreButton.addEventListener('click', () => {
    let value = genreButton.value.toLowerCase();
    Library.updateDisplay(value)
}))

const searchBar = document.querySelector('[data-search]');

searchBar.addEventListener('keydown', (e) =>{
    let value = e.target.value.toLowerCase();
    Library.search(value)
    })
