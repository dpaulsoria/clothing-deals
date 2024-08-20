// api/user/route.js
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing users
 */

import { NextRequest } from 'next/server';

import {
  User,
  SafeUser,
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUserById,
  deleteUserByEmail,
} from '@db/models/user.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'user';

function sanitizeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get a user by ID or email, or get all users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *         description: User email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  try {
    let result: User | User[];
    if (id) result = await getUserById(id);
    else if (email) result = await getUserByEmail(email);
    else result = await getAllUsers();

    if (!result) return NotFoundError(key, 'get');
    const safeUserData: SafeUser | SafeUser[] = Array.isArray(result)
      ? result.map(sanitizeUser)
      : sanitizeUser(result);
    return Success(safeUserData);
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *               isAdmin:
 *                 type: integer
 *                 description: Is the user an admin (0 or 1)
 *                 example: 0
 *               isActive:
 *                 type: integer
 *                 description: Is the user active (0 or 1)
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;
  let { isAdmin, isActive } = body;
  if (!name || !email || !password)
    return ParamsRequired(['name', 'email', 'password']);

  if (!isAdmin) isAdmin = 0;
  if (!isActive) isActive = 0;

  try {
    const result = await createUser({
      name,
      email,
      password,
      isAdmin,
      isActive,
    });
    if (result) return Success(result);
    else return NotFoundError(key, 'post');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: User ID
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *               isAdmin:
 *                 type: integer
 *                 description: Is the user an admin (0 or 1)
 *                 example: 0
 *               isActive:
 *                 type: integer
 *                 description: Is the user active (0 or 1)
 *                 example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request: NextRequest) {
  const userData: Partial<User> = await request.json();
  if (!userData.id) return ParamsRequired(['id']);
  if (Object.keys(userData).length === 1)
    return ParamsRequired(['name', 'email', 'password']);

  try {
    const result = await updateUser(userData);
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete a user by ID or email
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *         description: User email
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) return ParamsRequired(['id']);

  try {
    let result: User;
    if (id) result = await deleteUserById(id);
    if (result) return Success(result);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
