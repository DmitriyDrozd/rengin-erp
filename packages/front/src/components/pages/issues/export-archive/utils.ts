import getRestApi from "iso/src/getRestApi";

export const onArchiveExport = async ({selectedIds, types}: { selectedIds: string[], types: string[] }) => {
    const api = await getRestApi();
    const data = await api.archiveExport({selected: selectedIds, types});

    const url = data.url;
    const element = document.createElement('a');
    element.href = url;
    element.download = url;

    // simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
};
