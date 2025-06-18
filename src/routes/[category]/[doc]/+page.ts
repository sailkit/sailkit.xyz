import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => {
  const modules = import.meta.glob('/src/lib/docs/**/*.md');

  return Object.keys(modules).map((path) => {
    const parts = path.split('/');
    const category = parts[4];
    const doc = parts[5].replace('.md', '');

    return { category, doc };
  });
};

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
  try {
    const doc = await import(`$lib/docs/${params.category}/${params.doc}.md`);

    return {
      content: doc.default,
      details: doc.metadata,
      metadata: {
        title: doc.metadata.title
      }
    };
  } catch (e) {
    console.log(e);
    throw error(404, 'Oops, the page you are looking for does not exist.');
  }
};
