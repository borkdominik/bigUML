package com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.action;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.commons.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

import java.lang.Class;

public class AddActionCommand extends UmlSemanticElementCommand {

    protected final Action action;
    protected final Element parent;

    public AddActionCommand(final EditingDomain domain, final URI modelUri, final String parentUri, final String className) {
        super(domain, modelUri);
        try {
            // TODO: ADD SIGNAL AND TIME EVENT AT LATER STAGE
            Class<? extends Action> clazz = (Class<? extends Action>) Class.forName(className);
            if (OpaqueAction.class.equals(clazz)) {
                this.action = UMLFactory.eINSTANCE.createOpaqueAction();
            } else if (SendSignalAction.class.equals(clazz)) {
                this.action = UMLFactory.eINSTANCE.createSendSignalAction();
            } else if (CallBehaviorAction.class.equals(clazz)) {
                CallBehaviorAction cba = UMLFactory.eINSTANCE.createCallBehaviorAction();
                action = cba;
            } else {
                throw new RuntimeException("Invalid Action class: " + className);
            }
            parent = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doExecute() {
        Activity activity = null;
        if (parent instanceof Activity) {
            activity = (Activity) parent;
        } else {
            throw new RuntimeException("Invalid action container type: " + parent.getClass().getSimpleName());
        }

        activity.getOwnedNodes().add(action);
    }

    public Action getNewAction() {
        return action;
    }
}
