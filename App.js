import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const api = axios.create({
    baseURL: "http://localhost:5000/api/books", // change this if your backend URL is different
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await api.get("/");
    setBooks(res.data);
  };

  const addBook = async () => {
    if (!title || !author || !year) return alert("Please fill all fields!");
    await api.post("/", { title, author, year });
    setTitle("");
    setAuthor("");
    setYear("");
    setSnackbar({ open: true, message: "Book added!", severity: "success" });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await api.delete(`/${id}`);
      setSnackbar({ open: true, message: "Book deleted!", severity: "info" });
      fetchBooks();
    }
  };

  const updateBook = async () => {
    await api.put(`/${editingBook._id}`, editingBook);
    setEditingBook(null);
    setSnackbar({ open: true, message: "Book updated!", severity: "success" });
    fetchBooks();
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>📚 Book Inventory</Typography>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <TextField label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <Button variant="contained" onClick={addBook}>Add Book</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.year}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => setEditingBook(book)}>Edit</Button>
                  <Button color="error" onClick={() => deleteBook(book._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editingBook} onClose={() => setEditingBook(null)}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            value={editingBook?.title || ""}
            onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
          />
          <TextField
            label="Author"
            value={editingBook?.author || ""}
            onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
          />
          <TextField
            label="Year"
            value={editingBook?.year || ""}
            onChange={(e) => setEditingBook({ ...editingBook, year: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBook(null)}>Cancel</Button>
          <Button onClick={updateBook} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
