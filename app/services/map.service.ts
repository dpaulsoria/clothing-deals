// app/service/map.service.ts
import { ApiResponse, apiService } from '@/app/services/api.service';
import { Shapefile } from '@db/models/shapefile.model';
import { Geometry } from 'geojson';
import { Iguana } from '@db/models/iguana.model';
import { Iguana as IguanaFrontEnd, RastersDinamic } from '@lib/interfaces';
import { RasterFile } from '@db/models/raster.model';
import { State } from '@/db/models/state.model';
import { AgeClassification } from '@/db/models/age.classification.model';
import { CredentialsUser, User } from '@/db/models/user.model';
import { Workspace } from '@/db/models/workspace.model';
import { Statistics } from '@db/models/statistic.model';

const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response) {
    console.log('API response:', response.result);
    return response.result;
  }
  console.warn('API response is null');
  return null;
};
export const MapService = {
  // get Shapefile
  async getAllShapefiles(): Promise<Shapefile[] | null> {
    console.log('Fetching all shapefiles');
    const response = await apiService.get<Shapefile[]>('/shapefile');
    return handleApiResponse(response);
  },

  async getShapefileById(id: number): Promise<Shapefile | null> {
    console.log(`Fetching shapefile by id: ${id}`);
    const response = await apiService.get<Shapefile>(`/shapefile?id=${id}`);
    return handleApiResponse(response);
  },

  async getShapefileByUserId(user_id: number): Promise<Shapefile[] | null> {
    console.log(`Fetching shapefile by user id: ${user_id}`);
    const response = await apiService.get<Shapefile[]>(
      `/shapefile?user_id=${user_id}`
    );
    return handleApiResponse(response);
  },

  async getShapefileByWorkspaceId(
    workspace_id: number
  ): Promise<Shapefile[] | null> {
    console.log(`Fetching shapefile by workspace id: ${workspace_id}`);
    const response = await apiService.get<Shapefile[]>(
      `/shapefile?workspace_id=${workspace_id}`
    );
    return handleApiResponse(response);
  },
  // post shapefile
  async saveShapefile(shapefile: Shapefile): Promise<Shapefile | null> {
    console.log('Saving shapefile', shapefile);
    const response = await apiService.post<Shapefile>(`/shapefile`, shapefile);
    return handleApiResponse(response);
  },
  // delete shapefile

  async deleteShapefile(id: string): Promise<Shapefile | null> {
    const response = await apiService.delete<Shapefile>(`/shapefile?id=${id}`);
    return handleApiResponse(response);
  },
  //put shapefile
  async updateShapefile(shapefile: Shapefile): Promise<Shapefile | null> {
    console.log('Updating shapefile', shapefile);
    const response = await apiService.put<Shapefile>(`/shapefile`, shapefile);
    return handleApiResponse(response);
  },
  // Rasters
  async getRastersWithPagination(page: number, limit: number) {
    console.log(
      `Fetching rasters with pagination: page=${page}, limit=${limit}`
    );
    return await apiService.get<{
      result: RasterFile[];
      extra: string;
    }>(`/raster?page=${page}&limit=${limit}`);
  },
  async getAllRastersDinamic(
    data: RastersDinamic[]
  ): Promise<RastersDinamic[] | null> {
    console.log('Dinamic', data[0]);
    const response = await apiService.post<RastersDinamic[]>(
      '/raster/dinamic',
      data
    );
    return handleApiResponse(response);
  },
  async getRasterById(id: number): Promise<RasterFile | null> {
    console.log(`Fetching raster by id: ${id}`);
    const response = await apiService.get<RasterFile>(`/raster?id=${id}`);
    return handleApiResponse(response);
  },
  async getRasterByUserId(user_id: number): Promise<RasterFile[] | null> {
    console.log(`Fetching raster by user id: ${user_id}`);
    const response = await apiService.get<RasterFile[]>(
      `/raster?user_id=${user_id}`
    );
    return handleApiResponse(response);
  },
  async saveRaster(file): Promise<RasterFile | null> {
    console.log('Saving raster', file);
    const response = await apiService.post<RasterFile>(`/raster`, file);
    return handleApiResponse(response);
  },
  async updateRaster(
    file: Partial<RasterFile>
  ): Promise<Partial<RasterFile> | null> {
    const response = await apiService.put<Partial<RasterFile>>(`/raster`, file);
    return handleApiResponse(response);
  },
  async deleteRaster(id: number): Promise<RasterFile | null> {
    const response = await apiService.delete<RasterFile>(`/raster?id=${id}`);
    return handleApiResponse(response);
  },
  // Markers
  async getAllMarkers(): Promise<IguanaFrontEnd[] | null> {
    console.log('Fetching all markers');
    const response = await apiService.get<IguanaFrontEnd[]>('/marker');
    return handleApiResponse(response);
  },

  async getAllMarkersPagination(page: string, limit: string) {
    console.log('Fetching all markers');
    return await apiService.get<{
      result: Iguana[];
      extra: string;
    }>(`/marker?page=${page}&limit=${limit}`);
  },

  async getMarkersByTimeline(
    init: Date,
    finish: Date
  ): Promise<Iguana[] | null> {
    console.log(`Fetching markers by timeline from ${init} to ${finish}`);
    const response = await apiService.get<Iguana[]>(
      `/marker/filter?init=${init}&finish=${finish}`
    );
    return handleApiResponse(response);
  },

  async getMarkersByShapeId(shapefileId: number): Promise<Iguana[] | null> {
    console.log(`Fetching markers by shapefile id: ${shapefileId}`);
    const response = await apiService.get<Iguana[]>(
      `/marker/filter?shapefile_id=${shapefileId}`
    );
    return handleApiResponse(response);
  },

  async getMarkersByGeometry(geometry: Geometry): Promise<Iguana[] | null> {
    console.log('Fetching markers by geometry', geometry);
    const response = await apiService.get<Iguana[]>(
      `/marker/filter?geometry=${geometry}`
    );
    return handleApiResponse(response);
  },

  async saveMarker(marker: Iguana): Promise<Iguana | null> {
    console.log('Saving marker', marker);
    const response = await apiService.post<Iguana>(`/marker`, marker);
    return handleApiResponse(response);
  },

  async updateIguanas(marker: Iguana): Promise<Iguana | null> {
    console.log('Saving marker', marker);
    const response = await apiService.put<Iguana>(`/marker`, marker);
    return handleApiResponse(response);
  },
  async getAllIguanasByDateAndLayer(
    progressDate: string,
    endDate: string,
    id: number
  ): Promise<Iguana[] | null> {
    console.log(`Fetching state by id: ${id}`);
    const response = await apiService.get<Iguana[]>(
      `/marker/filter?shapefile_id=${id}&init=${progressDate}&finish=${endDate}`
    );
    return handleApiResponse(response);
  },
  // iguanas State

  async getAllStateIguana(): Promise<State[] | null> {
    console.log('Fetching all State');
    const response = await apiService.get<State[]>('/state');
    return handleApiResponse(response);
  },
  async getStateById(id: number): Promise<State | null> {
    console.log(`Fetching state by id: ${id}`);
    const response = await apiService.get<State>(`/state?id=${id}`);
    return handleApiResponse(response);
  },
  async deleteState(id: number): Promise<State | null> {
    const response = await apiService.delete<State>(`/state?id=${id}`);
    return handleApiResponse(response);
  },
  async createState(state: State): Promise<State | null> {
    console.log('Saving state', state);
    const response = await apiService.post<State>(`/state`, state);
    return handleApiResponse(response);
  },
  async updateState(state: State): Promise<State | null> {
    console.log('Updating state', state);
    const response = await apiService.put<State>(`/state`, state);
    return handleApiResponse(response);
  },

  // iguanas Age
  async getAllAgeIguana(): Promise<AgeClassification[] | null> {
    console.log('Fetching all rasters');
    const response =
      await apiService.get<AgeClassification[]>('/ageClassification');
    return handleApiResponse(response);
  },
  async getAgeById(id: number): Promise<AgeClassification | null> {
    console.log(`Fetching age by id: ${id}`);
    const response = await apiService.get<AgeClassification>(
      `/ageClassification?id=${id}`
    );
    return handleApiResponse(response);
  },
  async createAge(age: AgeClassification): Promise<AgeClassification | null> {
    console.log('Saving age', age);
    const response = await apiService.post<AgeClassification>(
      `/ageClassification`,
      age
    );
    return handleApiResponse(response);
  },
  async updateAge(age: AgeClassification): Promise<AgeClassification | null> {
    console.log('Updating age', age);
    const response = await apiService.put<AgeClassification>(
      `/ageClassification`,
      age
    );
    return handleApiResponse(response);
  },
  async deleteAge(id: number): Promise<AgeClassification | null> {
    const response = await apiService.delete<AgeClassification>(
      `/ageClassification?id=${id}`
    );
    return handleApiResponse(response);
  },
  // User
  async getAllUsers(): Promise<User[] | null> {
    console.log('Fetching all rasters');
    const response = await apiService.get<User[]>('/user');
    return handleApiResponse(response);
  },
  async getusersById(id: string): Promise<User[] | null> {
    console.log('Fetching all rasters');
    const response = await apiService.get<User[]>(`/user?id=${id}`);
    return handleApiResponse(response);
  },
  async getAllUsersByEmail(email: string): Promise<User[] | null> {
    console.log('Fetching all rasters');
    const response = await apiService.get<User[]>(`/user?email=${email}`);
    return handleApiResponse(response);
  },
  async createUser(user: User): Promise<User | null> {
    console.log('Saving user', user);
    const response = await apiService.post<User>(`/user`, user);
    return handleApiResponse(response);
  },
  async createUserbyEmail(
    user: CredentialsUser
  ): Promise<CredentialsUser | null> {
    console.log('Saving user', user);
    const response = await apiService.post<CredentialsUser>(
      `/auth/invite`,
      user
    );
    return handleApiResponse(response);
  },

  async updateUser(user: User): Promise<User | null> {
    console.log('Saving user', user);
    const response = await apiService.put<User>(`/user`, user);
    return handleApiResponse(response);
  },
  async deleteUser(id: number): Promise<User | null> {
    const response = await apiService.delete<User>(`/user?id=${id}`);
    return handleApiResponse(response);
  },

  // workspace

  async getAllWorkspaces(): Promise<Workspace[] | null> {
    console.log('Fetching all workspace');
    const response = await apiService.get<Workspace[]>(`/workspace`);
    return handleApiResponse(response);
  },
  async getAllWorkspacesById(id: number): Promise<Workspace | null> {
    console.log('Fetching all workspace');
    const response = await apiService.get<Workspace>(`/workspace?id=${id}`);
    return handleApiResponse(response);
  },
  async getAllWorkspacesByUserId(id: number): Promise<Workspace[] | null> {
    console.log('Fetching all workspace');
    const response = await apiService.get<Workspace[]>(
      `/workspace?user_id=${id}`
    );
    return handleApiResponse(response);
  },
  async createWorkspace(workspace: Workspace): Promise<Workspace | null> {
    console.log('Saving workspace', workspace);
    const response = await apiService.post<Workspace>(`/workspace`, workspace);
    return handleApiResponse(response);
  },

  async updateWorkspace(workspace: Workspace): Promise<Workspace | null> {
    console.log('Saving workspace', workspace);
    const response = await apiService.put<Workspace>(`/workspace`, workspace);
    return handleApiResponse(response);
  },
  async deleteWorkspace(id: number): Promise<Workspace | null> {
    const response = await apiService.delete<Workspace>(`/workspace?id=${id}`);
    return handleApiResponse(response);
  },
  //charts
  // charts
  async getAllStatisticsByUserId(id: number, page: number, limit: number) {
    console.log('Fetching all statistics for user with pagination');
    return await apiService.get<{
      statistics: Statistics[];
      total: string;
    }>(`/statistics?user_id=${id}&page=${page}&limit=${limit}`);
  },
  async createStatistics(statistics: Statistics): Promise<Statistics | null> {
    console.log('Saving workspace', statistics);
    const response = await apiService.post<Statistics>(
      `/statistics`,
      statistics
    );
    return handleApiResponse(response);
  },

  async updateStatistics(statistics: Statistics): Promise<Statistics | null> {
    console.log('Saving workspace', statistics);
    const response = await apiService.put<Statistics>(
      `/statistics`,
      statistics
    );
    return handleApiResponse(response);
  },
  async deleteStatistics(id: number): Promise<Statistics | null> {
    const response = await apiService.delete<Statistics>(
      `/statistics?id=${id}`
    );
    return handleApiResponse(response);
  },
};
