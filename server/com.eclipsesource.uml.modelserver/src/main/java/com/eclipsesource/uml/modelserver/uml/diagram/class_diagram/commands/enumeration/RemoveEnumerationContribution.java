package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public final class RemoveEnumerationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:remove_enumeration";

   public static CCompoundCommand create(final Package parent, final Enumeration semanticElement) {
      return new ContributionEncoder().type(TYPE).parent(parent).element(semanticElement).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var parent = decoder.parent(Package.class);
      var element = decoder.element(Enumeration.class);

      if (parent.isPresent() && element.isPresent()) {
         return new RemoveEnumerationCompoundCommand(context, parent.get(), element.get());
      }

      return new NoopCommand();
   }

}
