require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// const queries = require('./queries');


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

db.connect((err) => {
	if (err) throw err;
	console.log('Connected to database');
});

app.get('/', (req, res) => {
	const bookCountQuery = 'SELECT COUNT(*) as book_count FROM Books';
	const memberCountQuery = 'SELECT COUNT(*) as member_count FROM Members';
	const authorCountQuery = ` SELECT COUNT(DISTINCT Programming_Language) as author_count FROM Books `;
	const membersWithoutLoans = `
SELECT COUNT(Members.Member_ID) AS Members_Without_Loans
FROM Members
LEFT JOIN Loans ON Members.Member_ID = Loans.Member_ID AND Loans.Return_Date IS NULL
WHERE Loans.Member_ID IS NULL;
`;

	db.query(bookCountQuery, (err, bookCountResult) => {
		if (err) throw err;
		db.query(memberCountQuery, (err, memberCountResult) => {
			if (err) throw err;
			db.query(membersWithoutLoans, (err, withoutLoansCountResult) => {
				if (err) throw err;
				db.query(authorCountQuery, (err, authorCountResult) => {
					if (err) throw err;
					res.render('index', {
						membersWithoutLoans: withoutLoansCountResult[0].Members_Without_Loans,
						bookCount: bookCountResult[0].book_count,
						memberCount: memberCountResult[0].member_count,
						authorCount: authorCountResult[0].author_count
					});
				});
			});
		});
	});
});

app.get('/books', (req, res) => {
	const query = 'SELECT Book_ID, Programming_Language, Price, UPPER(Title) as BookTitle FROM Books ORDER BY Price DESC';
	db.query(query, (err, results) => {
		if (err) throw err;
		res.render('books', { books: results });
	});
});

app.get('/add-book', (req, res) => {
	res.render('add-book');
});

app.post('/add-book', (req, res) => {
	const { title, language, price } = req.body;
	const query = 'INSERT INTO Books (Title, Programming_Language, Price) VALUES (?, ?, ?)';
	db.query(query, [title, language, price], (err, result) => {
		if (err) throw err;
		res.redirect('/books');
	});
});

app.get('/members', (req, res) => {
	const query = 'SELECT * FROM Members';
	db.query(query, (err, results) => {
		if (err) throw err;
		res.render('members', { members: results });
	});
});

app.get('/add-member', (req, res) => {
	res.render('add-member');
});

app.post('/add-member', (req, res) => {
	const { name, email, joinDate } = req.body;
	const query = 'INSERT INTO Members (Name, Email, Join_Date) VALUES (?, ?, ?)';
	db.query(query, [name, email, joinDate], (err, result) => {
		if (err) throw err;
		res.redirect('/members');
	});
});

// Add these new endpoints for loans
app.get('/loans', (req, res) => {
	const query = `
SELECT l.Loan_ID, b.Title, m.Name, l.Loan_Date, l.Return_Date
FROM Loans l
JOIN Books b ON l.Book_ID = b.Book_ID
JOIN Members m ON l.Member_ID = m.Member_ID
`;
	db.query(query, (err, results) => {
		if (err) throw err;
		res.render('loans', { loans: results });
	});
});

app.get('/add-loan', (req, res) => {
	const bookQuery = 'SELECT Book_ID, Title FROM Books';
	const memberQuery = 'SELECT Member_ID, Name FROM Members';

	db.query(bookQuery, (err, bookResults) => {
		if (err) throw err;
		db.query(memberQuery, (err, memberResults) => {
			if (err) throw err;
			res.render('add-loan', { books: bookResults, members: memberResults });
		});
	});
});

app.post('/add-loan', (req, res) => {
	const { bookId, memberId, loanDate } = req.body;
	const query = 'INSERT INTO Loans (Book_ID, Member_ID, Loan_Date) VALUES (?, ?, ?)';
	db.query(query, [bookId, memberId, loanDate], (err, result) => {
		if (err) throw err;
		res.redirect('/loans');
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

