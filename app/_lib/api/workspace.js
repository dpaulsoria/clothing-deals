export async function fetchWorkspace(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/workspace?user_id=${userId}`,
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
    console.error('There was a problem fetching the workspace data:', error);
    throw error;
  }
}

export async function fetchAllWorkspaces() {
  try {
    const response = await fetch('http://localhost:3000/api/workspace', {
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
    console.error('There was a problem fetching all workspaces:', error);
    throw error;
  }
}
export async function fetchWorkspaceById(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/workspace?id=${id}`,
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
    console.error(
      `There was a problem fetching the workspace with ID ${id}:`,
      error
    );
    throw error;
  }
}
export async function fetchWorkspaceByUserId(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/workspace?user_id=${userId}`,
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
    console.error(
      `There was a problem fetching workspaces for user ID ${userId}:`,
      error
    );
    throw error;
  }
}
export async function updateWorkspace(workspace) {
  try {
    const response = await fetch('http://localhost:3000/api/workspace', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workspace),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem updating the workspace:', error);
    throw error;
  }
}
export async function deleteWorkspace(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/workspace?id=${id}`,
      {
        method: 'DELETE',
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
    console.error(
      `There was a problem deleting the workspace with ID ${id}:`,
      error
    );
    throw error;
  }
}
