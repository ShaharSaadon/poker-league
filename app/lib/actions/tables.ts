'use server';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getTables() {
  try {
    const tables = await prisma.table.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        createdById: true,
        currentGameId: true,
        players: true,
      },
    });

    if (!tables.length) {
      throw new Error('No tables found.');
    }

    return tables;
  } catch (error) {
    console.error('Error fetching tables:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch tables.'
    );
  }
}
export async function createTable({
  name,
  createdById,
  playerIds,
}: {
  name: string;
  createdById: string;
  playerIds: string[];
}) {
  try {
    const table = await prisma.table.create({
      data: {
        name,
        createdById,
        players: {
          connect: playerIds.map((id) => ({ id })),
        },
      },
    });
    return table;
  } catch (error) {
    console.error('Error creating table:', error);
    throw new Error('Failed to create table.');
  }
}
export async function getTablePages(query: string) {
  const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  try {
    const totalTables = await prisma.table.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            createdById: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            createdAt: {
              equals: isValidDate(query) ? new Date(query) : undefined,
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(totalTables / 10); // Assuming 10 items per page

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tables.');
  }
}

export async function getFilteredTables(query: string, currentPage: number) {
  const ITEMS_PER_PAGE = 10;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  try {
    const tables = await prisma.table.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            createdById: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            createdAt: {
              equals: isValidDate(query) ? new Date(query) : undefined,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
      include: {
        players: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return tables;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tables.');
  }
}
export async function getTableById(tableId: string) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      select: {
        id: true,
        createdById: true,
        createdAt: true,
      },
    });

    if (!table) {
      throw new Error(`Table with ID ${tableId} not found.`);
    }

    return table;
  } catch (error) {
    console.error('Error fetching table by ID:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch table by ID.'
    );
  }
}
