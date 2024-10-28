// index page
const bookCountQuery = 'SELECT COUNT(*) as book_count FROM Books';
const memberCountQuery = 'SELECT COUNT(*) as member_count FROM Members';
const authorCountQuery = ` SELECT COUNT(DISTINCT Programming_Language) as author_count FROM Books `;
const membersWithoutLoans = `
SELECT COUNT(Members.Member_ID) AS Members_Without_Loans
FROM Members
LEFT JOIN Loans ON Members.Member_ID = Loans.Member_ID AND Loans.Return_Date IS NULL
WHERE Loans.Member_ID IS NULL;
`;

// books page
const selectBooksQuery = 'SELECT Book_ID, Programming_Language, Price, UPPER(Title) as BookTitle FROM Books ORDER BY Price DESC';

// add-book page
const insertBookQuery = 'INSERT INTO Books (Title, Programming_Language, Price) VALUES (?, ?, ?)';

// members page
const selectMembersQuery = 'SELECT * FROM Members';

// add-member page
const insertMemberQuery = 'INSERT INTO Members (Name, Email, Join_Date) VALUES (?, ?, ?)';

// loans page
const selectLoansQuery = `
SELECT l.Loan_ID, UPPER(b.Title), m.Name, l.Loan_Date, l.Return_Date
FROM Loans l
JOIN Books b ON l.Book_ID = b.Book_ID
JOIN Members m ON l.Member_ID = m.Member_ID
`;

// add-loan page
const selectBookQuery = 'SELECT Book_ID, Title FROM Books';
const selectMemberQuery = 'SELECT Member_ID, Name FROM Members';

// add-loan page
const addLoanQuery = 'INSERT INTO Loans (Book_ID, Member_ID, Loan_Date) VALUES (?, ?, ?)';




module.exports = {
	bookCountQuery,
	memberCountQuery,
	authorCountQuery,
	selectBooksQuery,
	insertBookQuery,
	selectMembersQuery,
	insertMemberQuery,
	selectLoansQuery,
	selectBookQuery,
	selectMemberQuery,
	addLoanQuery,
	membersWithoutLoans
}
