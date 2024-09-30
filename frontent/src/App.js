import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/items');
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const addItem = async () => {
        await axios.post('http://localhost:5000/items', { name, age, gender });
        resetForm();
        fetchItems();
    };

    const updateItem = async () => {
        await axios.put(`http://localhost:5000/items/${editingItem._id}`, { name, age, gender });
        resetForm();
        fetchItems();
    };

    const deleteItem = async (id) => {
        await axios.delete(`http://localhost:5000/items/${id}`);
        fetchItems();
    };

    const resetForm = () => {
        setName('');
        setAge('');
        setGender('');
        setEditingItem(null);
    };

    const editItem = (item) => {
        setName(item.name);
        setAge(item.age);
        setGender(item.gender);
        setEditingItem(item);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>CRUD App</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    type="number"
                />
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {editingItem ? (
                    <button onClick={updateItem}>Update Item</button>
                ) : (
                    <button onClick={addItem}>Add Item</button>
                )}
            </div>
            <h2>Items List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Age</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Gender</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{item.name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{item.age}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{item.gender}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => editItem(item)}>Edit</button>
                                <button onClick={() => deleteItem(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
