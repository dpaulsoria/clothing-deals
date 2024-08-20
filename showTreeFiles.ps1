# showTreeFiles.ps1
# Define the path to the directory you want to scan
$rootPath = "C:\Users\danny\Desktop\gpg"

# Define the folders to exclude
$excludeFolders = @("node_modules", ".git", ".next")

# Function to print directory tree
function Print-DirectoryTree($path, $indent = "") {
    $items = Get-ChildItem -Path $path | Where-Object { -not ($_.Name -in $excludeFolders) }
    
    foreach ($item in $items) {
        Write-Output "$indent|- $($item.Name)"
        
        if ($item.PSIsContainer) {
            Print-DirectoryTree -path $item.FullName -indent ("$indent    ")
        }
    }
}

# Start printing the directory tree
Print-DirectoryTree -path $rootPath
