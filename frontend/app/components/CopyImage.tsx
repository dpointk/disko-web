import React, { useState, CSSProperties } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CopyImageFormProps {
    cluster: string; 
    availableImages: string[]; 
}

export function CopyImageForm({ cluster, availableImages }: CopyImageFormProps) {
    const [formData, setFormData] = useState({
        images: [] as string[],
        new_registry: '',
        tag: '',
        username: '',
        password: '',
        target_username: '',
        target_password: '',
    });

    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, selectedOptions } = e.target as HTMLSelectElement;
        if (type === "select-multiple" && name === "images") {
            const selectedImages = Array.from(selectedOptions as HTMLOptionsCollection).map(
                (option) => option.value
            );
            setFormData({
                ...formData,
                images: selectedImages,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        const params = new URLSearchParams({
            images: formData.images.join(','), // Encode images array
            new_registry: formData.new_registry,
            tag: formData.tag,
            username: formData.username,
            password: formData.password,
            target_username: formData.target_username,
            target_password: formData.target_password,
            cluster: cluster || '',
        });

        const query = params.toString();

        console.log(`Request URL: ${apiUrl}/api/copyimage?${query}`);

        try {
            const response = await fetch(`${apiUrl}/api/copyimage?${query}`, {
                method: 'GET',
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Success: Image(s) copied successfully!');
            } else {
                setMessage('Error in response');
            }
        } catch (error) {
            console.error('Fetch error:', error); // Log fetch error
            setMessage('Network error');
        }
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div>
            <button
                onClick={openModal}
                className="button-small"
            >
                Open Copy Image Form
            </button>

            {isOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={closeModal} style={styles.closeButton}>X</button>
                        <h2>Copy Image</h2>
                        <form onSubmit={handleSubmit} className="form-container">
                            <div className="form-body">
                                <div>
                                    <label htmlFor="images">Images:</label>
                                    <select
                                        id="images"
                                        name="images"
                                        multiple
                                        value={formData.images}
                                        onChange={handleChange}
                                        style={styles.input}
                                    >
                                        {availableImages.map((image) => (
                                            <option key={image} value={image}>
                                                {image}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="new_registry">New Registry URL:</label>
                                    <input
                                        type="text"
                                        id="new_registry"
                                        name="new_registry"
                                        value={formData.new_registry}
                                        onChange={handleChange}
                                        placeholder="Enter new registry URL"
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="target_username">Target Username:</label>
                                    <input
                                        type="text"
                                        id="target_username"
                                        name="target_username"
                                        value={formData.target_username}
                                        onChange={handleChange}
                                        placeholder="Enter target username"
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="target_password">Target Password:</label>
                                    <input
                                        type="password"
                                        id="target_password"
                                        name="target_password"
                                        value={formData.target_password}
                                        onChange={handleChange}
                                        placeholder="Enter target password"
                                        style={styles.input}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tag">Tag:</label>
                                    <input
                                        type="text"
                                        id="tag"
                                        name="tag"
                                        value={formData.tag}
                                        onChange={handleChange}
                                        placeholder="Enter image tag"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button className="button-small" type="submit">Submit</button>
                            </div>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        position: 'relative' as 'relative',
    },
    closeButton: {
        position: 'absolute' as 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        color: 'black',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '8px',
        margin: '8px 0',
        boxSizing: 'border-box' as 'border-box',  // Type assertion here
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
};
