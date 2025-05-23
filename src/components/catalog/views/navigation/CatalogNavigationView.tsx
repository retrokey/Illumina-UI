import { FC } from "react"
import { ICatalogNode } from "../../../../api"
import { useCatalog } from "../../../../hooks"
import { CatalogSearchView } from "../page/common/CatalogSearchView"
import { CatalogNavigationItemView } from "./CatalogNavigationItemView"
import { CatalogNavigationSetView } from "./CatalogNavigationSetView"

export interface CatalogNavigationViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { node = null } = props
    const { searchResult = null } = useCatalog()
    
    return (
        <>
            <CatalogSearchView />
            <div className="illumina-scrollbar size-full">
                <div className="grid w-full gap-0 overflow-auto">
                    { searchResult && (searchResult.filteredNodes.length > 0) && searchResult.filteredNodes.map((n, index) => <CatalogNavigationItemView key={ index } node={ n } />)}
                    { !searchResult && <CatalogNavigationSetView node={ node } /> }
                </div>
            </div>
        </>
    )
}
