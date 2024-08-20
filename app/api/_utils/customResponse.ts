export interface ApiRestResponse {
  get: {
    notFound: string;
    serverError: string;
  };
  post: {
    notFound: string;
    serverError: string;
  };
  put: {
    notFound: string;
    serverError: string;
  };
  delete: {
    notFound: string;
    serverError: string;
  };
}

export interface CustomResponse {
  user: ApiRestResponse;
  workspace: ApiRestResponse;
  state: ApiRestResponse;
  statistics: ApiRestResponse;
  shapefile: ApiRestResponse;
  shapeindex: ApiRestResponse;
  rasterfile: ApiRestResponse;
  marker: ApiRestResponse;
  ageClassification: ApiRestResponse;
  filetype: ApiRestResponse;
  mail: ApiRestResponse;
}

export const Responses: CustomResponse = {
  user: {
    get: {
      notFound: 'User not found',
      serverError: 'Error getting user information',
    },
    post: {
      notFound: 'User already exists',
      serverError: 'Error creating user',
    },
    put: {
      notFound: 'User not found for update',
      serverError: 'Error updating user',
    },
    delete: {
      notFound: 'User not found for deletion',
      serverError: 'Error deleting user',
    },
  },
  workspace: {
    get: {
      notFound: 'Workspace not found',
      serverError: 'Error getting workspace information',
    },
    post: {
      notFound: 'Workspace already exists',
      serverError: 'Error creating workspace',
    },
    put: {
      notFound: 'Workspace not found for update',
      serverError: 'Error updating workspace',
    },
    delete: {
      notFound: 'Workspace not found for deletion',
      serverError: 'Error deleting workspace',
    },
  },
  state: {
    get: {
      notFound: 'State not found',
      serverError: 'Error getting state information',
    },
    post: {
      notFound: 'State not found for update',
      serverError: 'Error updating state information',
    },
    put: {
      notFound: 'State not found for deletion',
      serverError: 'Error updating state information',
    },
    delete: {
      notFound: 'State not found for deletion',
      serverError: 'Error deleting state information',
    },
  },
  statistics: {
    get: {
      notFound: 'Statistics not found',
      serverError: 'Error getting statistic information',
    },
    post: {
      notFound: 'Statistics already exists',
      serverError: 'Error updating statistic information',
    },
    put: {
      notFound: 'Statistics not found for update',
      serverError: 'Error updating statistic information',
    },
    delete: {
      notFound: 'Statistics not found for deletion',
      serverError: 'Error deleting statistic information',
    },
  },
  shapefile: {
    get: {
      notFound: 'Geometry not found',
      serverError: 'Error getting geometry information',
    },
    post: {
      notFound: 'Geometry id already exists',
      serverError: 'Error updating geometry information',
    },
    put: {
      notFound: 'Geometry not found for update',
      serverError: 'Error updating geometry information',
    },
    delete: {
      notFound: 'Geometry not found for deletion',
      serverError: 'Error deleting geometry information',
    },
  },
  rasterfile: {
    get: {
      notFound: 'Raster not found',
      serverError: 'Error getting raster information',
    },
    post: {
      notFound: 'Raster id already exists',
      serverError: 'Error updating raster information',
    },
    put: {
      notFound: 'Raster not found for update',
      serverError: 'Error updating raster information',
    },
    delete: {
      notFound: 'Raster not found for deletion',
      serverError: 'Error deleting raster information',
    },
  },
  marker: {
    get: {
      notFound: 'Marker not found',
      serverError: 'Error getting marker information',
    },
    post: {
      notFound: 'Marker id already exists',
      serverError: 'Error updating marker information',
    },
    put: {
      notFound: 'Marker not found for update',
      serverError: 'Error updating marker information',
    },
    delete: {
      notFound: 'Marker not found for deletion',
      serverError: 'Error deleting marker information',
    },
  },
  shapeindex: {
    get: {
      notFound: 'Shapeindex not found',
      serverError: 'Error getting shapeindex information',
    },
    post: {
      notFound: 'Shapeindex id already exists',
      serverError: 'Error updating shapeindex information',
    },
    put: {
      notFound: 'Shapeindex not found for update',
      serverError: 'Error updating shapeindex information',
    },
    delete: {
      notFound: 'Shapeindex not found for deletion',
      serverError: 'Error deleting shapeindex information',
    },
  },
  ageClassification: {
    get: {
      notFound: 'Age Class not found',
      serverError: 'Error getting Age Class information',
    },
    post: {
      notFound: 'Age Class id already exists',
      serverError: 'Error updating Age Class information',
    },
    put: {
      notFound: 'Age Class not found for update',
      serverError: 'Error updating Age Class information',
    },
    delete: {
      notFound: 'Age Class not found for deletion',
      serverError: 'Error deleting Age Class information',
    },
  },
  filetype: {
    get: {
      notFound: 'Filetype not found',
      serverError: 'Error getting Filetype information',
    },
    post: {
      notFound: 'Filetype id already exists',
      serverError: 'Error updating Filetype information',
    },
    put: {
      notFound: 'Filetype not found for update',
      serverError: 'Error updating Filetype information',
    },
    delete: {
      notFound: 'Filetype not found for deletion',
      serverError: 'Error deleting Filetype information',
    },
  },
  mail: {
    get: {
      notFound: 'Filetype not found',
      serverError: 'Error getting Filetype information',
    },
    post: {
      notFound: 'Filetype id already exists',
      serverError: 'Error sending email invitation',
    },
    put: {
      notFound: 'Filetype not found for update',
      serverError: 'Error updating Filetype information',
    },
    delete: {
      notFound: 'Filetype not found for deletion',
      serverError: 'Error deleting Filetype information',
    },
  },
};
