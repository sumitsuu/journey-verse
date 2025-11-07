import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Art } from "@/src/types/models/art.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import z from "zod";

type AddToLibraryFormProps = {
  maxEpisodes: number;
  item: Art;
  handleModal: () => void;
  setIsInLib: Dispatch<SetStateAction<boolean>>;
};

const AddToLibraryForm = ({ maxEpisodes, item, setIsInLib, handleModal }: AddToLibraryFormProps) => {
  const ValidationSchema = z.object({
    episodes: z.coerce
      .number()
      .min(0)
      .superRefine((val, ctx) => {
        if (maxEpisodes === -1) {
          // allow null or undefined
        } else {
          if (val > maxEpisodes) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: maxEpisodes,
              type: "number",
              inclusive: true,
              message: `Must be at most ${maxEpisodes}`,
            });
          }
        }
      })
      .optional(),
    rating: z.coerce.number().min(0).max(10),
    status: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof ValidationSchema>>({
    mode: "onChange",
    resolver: zodResolver(ValidationSchema),
  });
  const libraryStatuses = [];
  const { typeId }: { typeId: string } = useParams();
  const { data: session } = useSession();
  const user = session?.user;

  const onSubmit = async (data: z.infer<typeof ValidationSchema>) => {
    if (typeId && user?.id) {
      // addLibraryItem(
      //     {
      //         statusId: data.status,
      //         ratingId: data.rating,
      //         userId: Number(user.id),
      //         artId: item.id,
      //     },
      //     Number(typeId)
      // )
      // setIsInLib(Boolean(response));
      handleModal();
    }
  };

  return (
    <Form {...form}>
      <form
        className={`w-full h-full flex flex-col gap-4 ${maxEpisodes > 1 && "justify-center"}`}
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
        })}
      >
        {maxEpisodes > 1 && (
          <FormField
            name="episodes"
            control={form.control}
            defaultValue={0}
            render={({ field, fieldState }) => (
              <>
                <FormLabel>Количество просмотренных эпизодов</FormLabel>
                <Input
                  placeholder={"Количество просмотренных эпизодов"}
                  value={field.value}
                  onChange={field.onChange}
                  variant={fieldState.invalid ? "invalid" : "default"}
                />
              </>
            )}
          />
        )}

        <FormField
          name="rating"
          control={form.control}
          defaultValue={0}
          render={({ field, fieldState }) => (
            <>
              <FormLabel>Оценка</FormLabel>
              <Input
                placeholder={"Оценка"}
                value={field.value}
                onChange={field.onChange}
                variant={fieldState.invalid ? "invalid" : "default"}
              />
            </>
          )}
        />
        {/* <FormField
                    name="status"
                    control={form.control}
                    defaultValue={libraryStatuses[0]?.id}
                    render={({ field: { ref, ...rest }, fieldState }) => (
                        <SelectComponent
                            placeholder="Выберите статус"
                            options={libraryStatuses.map((item) => ({
                                label: item.name,
                                value: item.id,
                            }))}
                        />
                    )}
                /> */}
        <Button variant={"secondary"}>Добавить</Button>
      </form>
    </Form>
  );
};

export default AddToLibraryForm;
