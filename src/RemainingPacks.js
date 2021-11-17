function RemainingPacks() {
	return <span className="remaining">Remaining Packs: {JSON.parse(sessionStorage.getItem('maxPacksCounter'))}</span>
}
export default RemainingPacks;