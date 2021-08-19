package com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.commons.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.UMLFactory;

public class AddActivityCommand extends UmlSemanticElementCommand {

    protected final Activity activity;

    public AddActivityCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.activity = UMLFactory.eINSTANCE.createActivity();
    }

    @Override
    protected void doExecute() {
        //TODO: CHANGE THIS IN OVERVIEW FILE
        activity.setName(UmlSemanticCommandUtil.getNewPackageableElementName(umlModel, Activity.class));
        umlModel.getPackagedElements().add(activity);
    }

    public Activity getNewActivity() { return activity; }

}
