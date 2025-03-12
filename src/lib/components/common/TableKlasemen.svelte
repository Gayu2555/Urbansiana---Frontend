<script>
  export let title = "Liga Inggris";
  export let data = [];
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden p-4">
  <h4 class="font-bold mb-3">{title}</h4>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klub</th>
          <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Main</th>
          <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
          <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
          <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">K</th>
          <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Poin</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data as team, i}
          <tr class={i < 4 ? "bg-green-50" : ""}>
            <td class="px-4 py-2 whitespace-nowrap">{i + 1}</td>
            <td class="px-4 py-2 whitespace-nowrap font-medium">{team.klub}</td>
            <td class="px-4 py-2 text-center whitespace-nowrap">{team.main}</td>
            <td class="px-4 py-2 text-center whitespace-nowrap">{team.menang}</td>
            <td class="px-4 py-2 text-center whitespace-nowrap">{team.seri}</td>
            <td class="px-4 py-2 text-center whitespace-nowrap">{team.kalah}</td>
            <td class="px-4 py-2 text-center whitespace-nowrap font-bold">{team.poin}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>