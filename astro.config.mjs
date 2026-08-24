// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/config';

export default defineConfig({
  site: SITE.url,
  output: 'static',
});
