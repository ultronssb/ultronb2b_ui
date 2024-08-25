import { useState, useRef } from 'react';
import { FileButton, Button, Group, Text } from '@mantine/core';

function ProductImage() {
    const [file, setFile] = useState(null);
    const resetRef = useRef(null);

    const clearFile = () => {
        setFile(null);
        resetRef.current?.();
    };

    return (
        <>
            {file && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Selected"
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <Text size="sm" ta="center" mt="sm">
                        Picked file: {file.name}
                    </Text>
                    
                </div>
            )}

            <Group justify="center">
                <FileButton resetRef={resetRef} onChange={setFile} accept="image/png,image/jpeg">
                    {(props) => <Button {...props}>Upload image</Button>}
                </FileButton>
                <Button disabled={!file} color="red" onClick={clearFile}>
                    Reset
                </Button>
            </Group>
        </>
    );
}

export default ProductImage;
