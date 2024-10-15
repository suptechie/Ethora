import { TableHead, TableRow, TableCell, Tooltip, Box } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import { FC } from "react"

    // displayName => displayName
    // users => totalRegistered
    // sessions => totalSessions
    // api => totalApiCalls
    // files => totalFiles
    // web3 => totalTransactions
    // createdAt => createdAt

export type CellId =
  | "displayName"
  | "totalRegistered"
  | "totalSessions"
  | "chats"
  | "totalApiCalls"
  | "totalFiles"
  | "totalTransactions"
  | "createdAt"
  | "actions"

type TableCellAlign = "inherit" | "left" | "center" | "right" | "justify"
type Order = "asc" | "desc"
interface HeadCell {
  disablePadding: boolean
  id: CellId
  label: string
  numeric: boolean
  description?: string
  align: TableCellAlign
}

const headCells: readonly HeadCell[] = [
  {
    id: "displayName",
    numeric: true,
    disablePadding: false,
    label: "Display Name",
    align: "left",
  },
  {
    id: "totalRegistered",
    numeric: true,
    disablePadding: false,
    label: "Users",
    description: "Users registered (total vs 24h)",
    align: "center",
  },
  {
    id: "totalSessions",
    numeric: true,
    disablePadding: false,

    label: "Sessions",
    description: "User sessions (total vs 24h)",
    align: "center",
  },
  {
    id: "chats",
    numeric: true,
    disablePadding: false,
    label: "Chats",
    description: "Chat messages (total vs 24h)",
    align: "center",
  },
  {
    id: "totalApiCalls",
    numeric: true,
    disablePadding: false,
    label: "API",
    description: "API calls (total vs 24h)",
    align: "center",
  },
  {
    id: "totalFiles",
    numeric: true,
    disablePadding: false,
    label: "Files",
    description: "Files (total vs 24h)",
    align: "center",
  },
  {
    id: "totalTransactions",
    numeric: true,
    disablePadding: false,
    label: "Web3",
    description: "Blockchain transactions (total vs 24h)",
    align: "center",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,

    label: "Created",
    description: "App creation date",
    align: "center",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,

    label: "Actions",
    align: "right",
  },
]

interface AppsTableHeadProps {
  order: Order
  orderBy: CellId
  onRequestSort: (property: CellId) => void
  isLoading: boolean
}

export const AppsTableHead: FC<AppsTableHeadProps> = ({
  order,
  orderBy,
  onRequestSort,
  isLoading,
}) => {
  const createSortHandler = (property) => () => {
    onRequestSort(property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {!!headCell.description && (
                <Tooltip title={headCell.description}>
                  <InfoIcon
                    color="primary"
                    fontSize={"small"}
                    sx={{ marginLeft: 1 }}
                  />
                </Tooltip>
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
