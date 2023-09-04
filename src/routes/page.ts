import { Request, Response, Router } from 'express';
import { queryDB } from '../db';
import { Page, PageRow } from './types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const pages: Page[] = await queryDB('SELECT id, title FROM Page');
    const pagesWithBreadcrumbs = await Promise.all(
      pages.map(async (page) => {
        const subPages = await getSubPagesById(page.id);
        const breadcrumbs = await getBreadcrumbs(page.id);
        return {
          ...page,
          subPages: subPages.map((subPage) => subPage.title),
          breadcrumbs: breadcrumbs.map((b) => b.title),
        };
      })
    );
    res.json(pagesWithBreadcrumbs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const pageId = parseInt(req.params.id, 10);
  if (isNaN(pageId)) {
    return res.status(400).json({ error: 'Invalid page ID' });
  }

  try {
    const page = await getPageById(pageId);
    const subPages = await getSubPagesById(pageId);
    const breadcrumbs = await getBreadcrumbs(pageId);

    const response = {
      pageId: page?.id,
      title: page.title,
      content: page.content,
      subPages: subPages,
      breadcrumbs: breadcrumbs.map((b) => b.title),
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

async function getPageById(id: number): Promise<Page> {
  const pages: Page[] = await queryDB('SELECT * FROM Page WHERE id = ?', [id]);
  return pages[0];
}

async function getSubPagesById(parentId: number): Promise<Page[]> {
  return await queryDB('SELECT id, title FROM Page WHERE parent_id = ?', [parentId]);
}

async function getBreadcrumbs(pageId: number): Promise<PageRow[]> {
  const sql = `
  WITH RECURSIVE Breadcrumbs AS 
  (
      SELECT id, title, parent_id, 0 as depth
      FROM Page 
      WHERE id = ?
      UNION ALL
      SELECT p.id, p.title, p.parent_id, b.depth + 1
      FROM Page p
      JOIN Breadcrumbs b ON p.id = b.parent_id
  )
  SELECT title FROM Breadcrumbs ORDER BY depth DESC;
  `;

  return await queryDB(sql, [pageId]);
}

export default router;
