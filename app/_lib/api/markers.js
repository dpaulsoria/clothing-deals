export async function getMarkerById(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/marker?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the marker by ID:', error);
    throw error;
  }
}
export async function getAllMarkers() {
  try {
    const response = await fetch('http://localhost:3000/api/marker', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching all markers:', error);
    throw error;
  }
}
export async function getMarkerByUserId(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/marker?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the marker by user ID:', error);
    throw error;
  }
}
export async function createMarker(markerData) {
  try {
    const response = await fetch('http://localhost:3000/api/marker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(markerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem creating the marker:', error);
    throw error;
  }
}
export async function updateMarker(markerData) {
  try {
    const response = await fetch('http://localhost:3000/api/marker', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(markerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem updating the marker:', error);
    throw error;
  }
}
export async function deleteMarker(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/marker?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem deleting the marker:', error);
    throw error;
  }
}

export async function createIguanabyCsv(userId, results) {
  try {
    // Construir el cuerpo de la solicitud
    const body = JSON.stringify({
      user_id: userId,
      results: results,
    });

    // Realizar la solicitud POST
    const response = await fetch('http://localhost:3000/api/marker/csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parsear la respuesta a JSON
    const data = await response.json();
    return data; // Devuelve los IDs de los marcadores creados
  } catch (error) {
    console.error(
      'Hubo un problema al crear los marcadores de iguanas:',
      error
    );
    throw error;
  }
}
