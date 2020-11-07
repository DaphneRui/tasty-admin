<template>
  <div>
    <Admin />
  </div>
</template>

<script>
import Admin from './views/Admin/Admin';
export default {
   name: 'App',
   components: {
      Admin
   }
};
</script>
<style lang="scss" scope>
*{
  padding : 0;
  margin : 0;
}
</style>
