CREATE TABLE Books (
    Book_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Programming_Language VARCHAR(50),
    Price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Members (
    Member_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Join_Date DATE NOT NULL
);

CREATE TABLE Loans (
    Loan_ID INT PRIMARY KEY AUTO_INCREMENT,
    Book_ID INT,
    Member_ID INT,
    Loan_Date DATE NOT NULL,
    Return_Date DATE,
    FOREIGN KEY (Book_ID) REFERENCES Books(Book_ID),
    FOREIGN KEY (Member_ID) REFERENCES Members(Member_ID)
);

-- Seed 
INSERT INTO Books (Title, Programming_Language, Price) VALUES
('Python Crash Course', 'Python', 29.99),
('JavaScript: The Good Parts', 'JavaScript', 24.99),
('Clean Code', 'Java', 34.99),
('The C Programming Language', 'C', 39.99);

INSERT INTO Members (Name, Email, Join_Date) VALUES
('John Doe', 'john@example.com', '2023-01-15'),
('Jane Smith', 'jane@example.com', '2023-02-20'),
('Bob Johnson', 'bob@example.com', '2023-03-10');
