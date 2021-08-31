package com.eclipsesource.uml.modelserver.commands.activitydiagram.compound.action;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.notation.action.AddActionShapeCommand;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.action.AddActionCommand;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Action;
import java.util.function.Supplier;

public class AddActionCompoundCommand extends CompoundCommand {

    public AddActionCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                    final String parentUri, final String clazzName) {

        AddActionCommand command = new AddActionCommand(domain, modelUri, parentUri, clazzName);
        this.append(command);
        Supplier<Action> semanticResultSupplier = command::getNewAction;
        this.append(new AddActionShapeCommand(domain, modelUri, position, semanticResultSupplier));
    }

}
