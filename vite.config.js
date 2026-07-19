import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact.html'),
        blog: resolve(__dirname, 'blog.html'),
        certificates: resolve(__dirname, 'certificates.html'),
        caseStudyFindra: resolve(__dirname, 'case-study-findra.html'),
        caseStudySharepulse: resolve(__dirname, 'case-study-sharepulse.html'),
        caseStudyFashionstore: resolve(__dirname, 'case-study-fashionstore.html'),
        caseStudyPixaura: resolve(__dirname, 'case-study-pixaura.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
