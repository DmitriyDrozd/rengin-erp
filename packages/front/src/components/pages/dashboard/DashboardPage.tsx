import AppLayout from "../../app/AppLayout";

export  default () => {
    return  <AppLayout
        hidePageContainer={true}
        proLayout={{contentStyle:{
                padding: '0px'
            }
        }}
    >
        <div> Dashboard
        </div>
    </AppLayout>
}