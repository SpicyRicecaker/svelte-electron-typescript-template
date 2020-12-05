<script lang="ts">
  let name = 'hello world';
</script>

<style lang="scss">
  :global(body) {
    margin: 0;
    padding: 0;
  }
  main {
    // Max out content
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    // Make it more native, turn it on later if needed
    user-select: none;
  }
</style>

<main>{name}</main>
