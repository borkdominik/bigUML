package com.eclipsesource.uml.modelserver.commands.statemachinediagram.region;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Region;

import java.util.function.Supplier;

public class AddRegionCompoundCommand extends CompoundCommand {

   public AddRegionCompoundCommand(final EditingDomain domain, final URI modelUri,
                                   final GPoint position, final String parentSemanticUri) {
      AddRegionCommand command = new AddRegionCommand(domain, modelUri, parentSemanticUri);
      this.append(command);
      Supplier<Region> semanticResultSupplier = command::getNewRegion;
      this.append(new AddRegionShapeCommand(domain, modelUri, position, semanticResultSupplier));
   }
}
