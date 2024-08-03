// FIXME(ybg) 240803 https://docs.nestjs.com/techniques/configuration
export default () => ({
  DATABASE_URL: process.env.DATABASE_URL,
});
