package com.eclipsesource.uml.modelserver.commands.activitydiagram.compound;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.notation.AddActivityShapeCommand;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.AddActivityCommand;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Activity;

import java.util.function.Supplier;

public class AddActivityCompoundCommand extends CompoundCommand {

    public AddActivityCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {

        // Chain semantic and notation command
        AddActivityCommand command = new AddActivityCommand(domain, modelUri);
        this.append(command);
        Supplier<Activity> semanticResultSupplier = () -> command.getNewActivity();
        this.append(new AddActivityShapeCommand(domain, modelUri, position, semanticResultSupplier));

    }
}
