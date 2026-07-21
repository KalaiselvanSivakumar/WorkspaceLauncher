interface PageHeaderProps {
    title: string
}

function PageHeader({ title }: PageHeaderProps) {
    return (
        <h1 className="border-b border-border px-6 py-4 font-heading text-base font-medium">
            {title}
        </h1>
    )
}

export default PageHeader;