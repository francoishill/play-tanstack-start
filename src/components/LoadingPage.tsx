import {
  ButtonSkeleton,
  ContainerSkeleton,
  PaperSkeleton,
  StackSkeleton,
  TextSkeleton,
  TitleSkeleton,
} from "~/components/Skeleton";

export function LoadingPage() {
  return (
    <ContainerSkeleton>
      <StackSkeleton gap="1.5rem">
        {/* Header section */}
        <div>
          <TitleSkeleton />
          <div style={{ marginTop: "0.5rem" }}>
            <TextSkeleton width="350px" />
          </div>
        </div>

        {/* Main paper with button */}
        <PaperSkeleton>
          <StackSkeleton gap="1rem">
            <ButtonSkeleton />
          </StackSkeleton>
        </PaperSkeleton>
      </StackSkeleton>
    </ContainerSkeleton>
  );
}
