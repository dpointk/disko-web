"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ClusterSelectorProps {
    onClusterChange: (cluster: string) => void;
}

const ClusterSelector: React.FC<ClusterSelectorProps> = ({ onClusterChange }) => {
    const [clusters, setClusters] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<string>('');

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${apiUrl}/api/clusters`);
                setClusters(response.data);
            } catch (err) {
                setError('Failed to load clusters');
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCluster(event.target.value);
    };

    const handleSubmit = async () => {
        if (selectedCluster === '') {
            setError('Please select a cluster');
            return;
        }
        
        try {
            await axios.post(`${apiUrl}/api/selected-cluster`, { cluster: selectedCluster });
            onClusterChange(selectedCluster);
            
            // Dispatch custom event with the selected cluster
            const event = new CustomEvent('update-statistics', { detail: { cluster: selectedCluster } });
            window.dispatchEvent(event);
        } catch (err) {
            setError('Failed to select cluster');
        }
    };

    return (
        <div>
            {loading && <p>Loading clusters...</p>}
            {error && <p>{error}</p>}
            <select onChange={handleChange} value={selectedCluster}>
                <option value="" disabled>Select a cluster</option>
                {clusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                        {cluster}
                    </option>
                ))}
            </select>
            <button
                className="button-small"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default ClusterSelector;
